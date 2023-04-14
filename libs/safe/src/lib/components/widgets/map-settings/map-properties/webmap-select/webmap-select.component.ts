import {
  Component,
  ViewChild,
  Input,
  Provider,
  forwardRef,
  OnInit,
} from '@angular/core';
import { ArcgisService } from '../../../../../../lib/services/map/arcgis.service';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import {
  ControlValueAccessor,
  UntypedFormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CommonModule } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { MatLegacyFormFieldControl as MatFormFieldControl } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Control value accessor
 */
const CONTROL_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => WebmapSelectComponent),
  multi: true,
};

/**
 *
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    TranslateModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  selector: 'safe-webmap-select',
  templateUrl: './webmap-select.component.html',
  styleUrls: ['./webmap-select.component.scss'],
  providers: [
    CONTROL_VALUE_ACCESSOR,
    {
      provide: MatFormFieldControl,
      useExisting: WebmapSelectComponent,
    },
  ],
})
export class WebmapSelectComponent implements ControlValueAccessor, OnInit {
  @Input() formControl!: UntypedFormControl;

  @Input() formControlName!: string;

  @Input() placeholder!: string;

  filteredOptions$!: Observable<any[]>;
  optionsSubject = new Subject<any>();
  public searchValue = new UntypedFormControl('');

  private onTouched!: any;
  private onChanged!: any;

  public value = '';
  public items: any[] = [];
  private start = 1;
  private loading = true;
  private nextPage = true;

  @ViewChild('arcGisWebMap') elementSelect?: MatSelect;

  /**
   * Map Properties of Map widget.
   *
   * @param arcgis service
   */
  constructor(private arcgis: ArcgisService) {}
  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    this.search();
    this.filteredOptions$ = this.optionsSubject.asObservable();
    setTimeout(() => {
      this.optionsSubject.next(this.items);
    }, 1000);
    this.searchValue.valueChanges.subscribe((value: any) => {
      this.optionsSubject.next(this.filter(value));
    });
  }

  /**
   *
   * @param value
   */
  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const teste = this.items.filter((item) =>
      item.title.toLowerCase().includes(filterValue)
    );
    console.log(teste);
    return teste;
  }

  /**
   * Register change of the select
   *
   * @param e event
   */
  public selectionOnChange(e: any) {
    this.value = e.value;
    this.onChanged(this.value);
  }

  /**
   * Register change of the control
   *
   * @param fn callback
   */
  public registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Write new value
   *
   * @param value id of webmap
   */
  writeValue(value: string): void {
    this.value = JSON.parse(JSON.stringify(value));
  }

  /**
   * Search for webmap data in argcis-rest-request using arcgis service
   */
  private search(): void {
    this.arcgis.searchItems({ start: this.start }).then((search) => {
      if (search.nextStart > this.start) {
        this.start = search.nextStart;
      } else {
        this.nextPage = false;
      }
      this.items = this.items.concat(search.results);
      this.loading = false;
    });
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.elementSelect) {
      const panel = this.elementSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Load on Scroll
   *
   * @param event handler
   */
  private loadOnScroll(event: any): void {
    if (
      event.target.scrollHeight -
        (event.target.clientHeight + event.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.nextPage) {
        this.loading = true;
        this.search();
      }
    }
  }
}
