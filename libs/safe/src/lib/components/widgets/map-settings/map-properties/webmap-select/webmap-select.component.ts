import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import { ArcgisService } from '../../../../../../lib/services/map/arcgis.service';
import {
  ControlValueAccessor,
  UntypedFormControl,
  FormsModule,
  ReactiveFormsModule,
  NgControl,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
} from '@oort-front/ui';

/**
 *
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormWrapperModule,
    TranslateModule,
    SelectMenuModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
  ],
  selector: 'safe-webmap-select',
  templateUrl: './webmap-select.component.html',
  styleUrls: ['./webmap-select.component.scss'],
})
export class WebmapSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  public searchControl = new UntypedFormControl('');

  private onTouched!: any;
  private onChanged!: any;

  public value = '';
  public items = new BehaviorSubject<any[]>([]);
  public items$ = this.items.asObservable();
  private start = 1;
  public loading = true;
  private nextPage = true;
  private scrollListener!: any;

  /**
   * Map Properties of Map widget.
   *
   * @param arcgis service
   * @param document Document
   * @param renderer current renderer
   * @param ngControl current ng control
   */
  constructor(
    private arcgis: ArcgisService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
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
        this.loading = true;
        this.start = 0;
        // this.items.next([]);
        this.search(value);
      });
  }

  /**
   * Register change of the select
   *
   * @param e event
   */
  public selectionOnChange(e: any) {
    // If no value is set into no this.value return
    if (!e && !this.ngControl?.control?.value) {
      return;
    }
    this.onChanged(e);
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
  writeValue(value: any): void {
    if (value) {
      this.value = JSON.parse(JSON.stringify(value));
    } else {
      this.value = value;
    }
  }

  /**
   * Reset search
   */
  resetSearch(): void {
    if (this.searchControl.value) {
      this.searchControl.setValue('');
    }
  }

  /**
   * Search for webmap data in argcis-rest-request using arcgis service
   *
   * @param text search text
   */
  private search(text?: string): void {
    this.arcgis.searchItems({ start: this.start, text }).then((search) => {
      if (search.nextStart > this.start) {
        this.start = search.nextStart;
      } else {
        this.nextPage = false;
      }
      this.items.next([]);
      if (text) {
        this.items.next(
          this.items
            .getValue()
            .concat(
              search.results.filter(
                (a) =>
                  a.id != this.value ||
                  a.title.toLowerCase().includes(text.toLowerCase())
              )
            )
        );
      } else {
        this.items.next(this.items.getValue().concat(search.results));
      }
      this.loading = false;
    });
  }

  /**
   * Adds scroll listener to select.
   *
   */
  onOpenSelect(): void {
    const panel = this.document.getElementById('optionList');
    if (panel) {
      if (this.scrollListener) {
        this.scrollListener();
      }
      this.scrollListener = this.renderer.listen(
        panel,
        'scroll',
        (event: any) => this.loadOnScroll(event)
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
        this.search(this.searchControl.value);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
