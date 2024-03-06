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
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import uniqBy from 'lodash/uniqBy';
import { UnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

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
    TooltipModule,
  ],
  selector: 'shared-webmap-select',
  templateUrl: './webmap-select.component.html',
  styleUrls: ['./webmap-select.component.scss'],
})
export class WebmapSelectComponent
  extends UnsubscribeComponent
  implements ControlValueAccessor, OnInit, OnDestroy
{
  /** Search control form*/
  public searchControl = new UntypedFormControl('');

  /** Value of the select */
  public value = '';
  /** Items of the select */
  public items = new BehaviorSubject<any[]>([]);
  /** Items observable */
  public items$ = this.items.asObservable();
  /** Start of the search */
  private start = 1;
  /** Loading state */
  public loading = true;
  /** Next page */
  private nextPage = true;
  /** Scroll listener */
  private scrollListener!: any;

  /** Shell function for touch */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};
  /**
   *  Shell function for change
   *
   * @param _ value
   */
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
    super();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Subscribe to settings changes to update map.
   */
  ngOnInit(): void {
    if (this.value) {
      this.arcgis.searchItemById(this.value).then((item) => {
        if (item) {
          // Add item at beginning of the list
          this.items.next(
            uniqBy([...item.results, ...this.items.getValue()], 'id')
          );
        }
      });
    }
    this.search();
    // this way we can wait for 0.5s before sending an update
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        this.start = 0;
        this.nextPage = true;
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
   * Search for webmap data in argcis-rest-request using arcgis service
   *
   * @param text search text
   */
  private search(text?: string): void {
    const queryOptions = {
      start: this.start,
      text,
      ...(this.value && {
        exclude: this.value,
      }),
    };
    this.arcgis.searchItems(queryOptions).then((search) => {
      if (search.nextStart > this.start) {
        this.start = search.nextStart;
      } else {
        this.nextPage = false;
      }
      const items = this.items.getValue();
      // if (text) {
      //   this.items.next(
      //     this.items
      //       .getValue()
      //       .concat(
      //         search.results.filter(
      //           (a) =>
      //             a.id != this.value ||
      //             a.title.toLowerCase().includes(text.toLowerCase())
      //         )
      //       )
      //   );
      // } else {
      //   this.items.next(this.items.getValue().concat(search.results));
      // }
      // Due to pagination we need to remove duplicates
      this.items.next(
        uniqBy([...items, ...search.results], 'id')
        // this.items
        //   .getValue()
        //   .filter(
        //     (item, index) =>
        //       this.items.getValue().findIndex((a) => a.id === item.id) === index
        //   )
      );
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
