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

  public value = '';
  public items = new BehaviorSubject<any[]>([]);
  public items$ = this.items.asObservable();
  private start = 1;
  public loading = true;
  private nextPage = true;
  private scrollListener!: any;
  public selectedLabel = '';
  public showHiddenOption = false;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  private onChanged = (_: any) => {};

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
  public registerOnChange(fn: (_: any) => void): void {
    this.onChanged = fn;
  }

  /**
   * Register touch event
   *
   * @param fn callback
   */
  public registerOnTouched(fn: () => void): void {
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
   * Clear search input
   */
  clearSearch(): void {
    if (this.ngControl.value) this.searchControl.setValue('');
  }

  /**
   * Event handler from the select menu
   *
   * @param e event
   */
  selectedOption(e: any) {
    // since clearSearch() will trigger the asynchronous search method, it might be necessary to remove it,
    // or at least to make sure that the setHiddenOption is not called too early
    this.clearSearch();
    this.setHiddenOption(e);
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

      this.setHiddenOption(this.ngControl.value);

      this.loading = false;
    });
  }

  /**
   * Handy helper that sets up the hidden option that is used
   * to make sure the selected value is always displayed,
   * even if it's not in the list of items
   *
   * @param id id of the selected item
   */
  private setHiddenOption(id: string): void {
    // the goal is to set both this.selectedLabel and this.showHiddenOption
    // if the selected item is in the list of items, need to set
    // this.showHiddenOption to false
    const item = this.items.getValue().find((item) => item.id === id);
    if (item) {
      this.selectedLabel = item.title;
      this.showHiddenOption = false;
    } else {
      // if the selected item is not in the list of items, we need to fetch it
      this.arcgis.searchItems({ id }).then((search) => {
        // this will somehow return results with different ids (because arcgis search for map of type webmap OR maps with id === id)
        const res = search.results.find((res) => res.id === id);
        if (res) {
          this.selectedLabel = res.title;
          this.showHiddenOption = true;
        }
      });
    }
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
