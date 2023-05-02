import { Component, ViewChild, OnInit, Optional, Self } from '@angular/core';
import { ArcgisService } from '../../../../../../lib/services/map/arcgis.service';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';
import {
  ControlValueAccessor,
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
  NgControl,
} from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { CommonModule } from '@angular/common';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

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
    SafeButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
  ],
  selector: 'safe-webmap-select',
  templateUrl: './webmap-select.component.html',
  styleUrls: ['./webmap-select.component.scss'],
})
export class WebmapSelectComponent implements ControlValueAccessor, OnInit {
  public searchControl = new UntypedFormControl('');

  private onTouched!: any;
  private onChanged!: any;

  public value = '';
  public items = new BehaviorSubject<any[]>([]);
  public items$ = this.items.asObservable();
  private start = 1;
  private loading = true;
  private nextPage = true;

  @ViewChild('arcGisWebMap') elementSelect?: MatSelect;

  /**
   * Map Properties of Map widget.
   *
   * @param arcgis service
   */
  constructor(
    private arcgis: ArcgisService,
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    this.search();
    // this way we can wait for 0.5s before sending an update
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.start = 0;
        this.items.next([]);
        this.search(value);
      });
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
  private search(text?: string): void {
    this.arcgis
      .searchItems({ start: this.start, text, id: this.ngControl.value })
      .then((search) => {
        if (search.nextStart > this.start) {
          this.start = search.nextStart;
        } else {
          this.nextPage = false;
        }
        this.items.next(this.items.getValue().concat(search.results));
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
