import {
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelect,
} from '@angular/material/select';
import { Overlay } from '@angular/cdk/overlay';
import { scrollFactory } from '../../utils/scroll-factory';
import { get } from 'lodash';
import {
  MatFormField,
  MatFormFieldControl,
  MAT_FORM_FIELD,
} from '@angular/material/form-field';
import {
  FormBuilder,
  FormControl,
  NgControl,
  ControlValueAccessor,
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  GET_APPLICATIONS,
  GET_RESOURCES,
  GET_API_CONFIGURATIONS,
  GET_FORMS,
  GET_REFERENCE_DATAS,
} from '../../graphql/queries';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/** Array with available queries and its configuration */
const AVAILABLE_QUERIES = {
  resources: {
    query: GET_RESOURCES,
    label: 'common.resource.one',
  },
  forms: {
    query: GET_FORMS,
    label: 'common.form.one',
  },
  applications: {
    query: GET_APPLICATIONS,
    label: 'common.application.one',
  },
  apiConfigurations: {
    query: GET_API_CONFIGURATIONS,
    label: 'common.apiConfiguration.one',
  },
  referenceDatas: {
    query: GET_REFERENCE_DATAS,
    label: 'common.referenceData.one',
  },
};

/** Available queries type */
type AvailableQueries = keyof typeof AVAILABLE_QUERIES;

/** Component for a dropdown with pagination */
@Component({
  selector: 'safe-paginated-dropdown',
  templateUrl: './paginated-dropdown.component.html',
  styleUrls: ['./paginated-dropdown.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MatFormFieldControl,
      useExisting: SafePaginatedDropdownComponent,
    },
  ],
})
export class SafePaginatedDropdownComponent
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string>
{
  static nextId = 0;
  /**
   * Gets the value
   *
   * @returns the value
   */
  @Input() get value(): string | null {
    if (this.selected) return this.selected.value;
    return null;
  }

  /** Sets the value */
  set value(val: string | null) {
    this.selected.setValue(val || '');
    this.onChange(val);
    this.stateChanges.next();
  }

  public stateChanges = new Subject<void>();
  @HostBinding()
  id = `safe-paginated-dropdown-${SafePaginatedDropdownComponent.nextId++}`;

  /**
   * Gets the placeholder for the select
   *
   * @returns the placeholder
   */
  @Input()
  get placeholder() {
    return this.ePlaceholder;
  }

  /**
   * Sets the placeholder
   */
  set placeholder(plh) {
    this.ePlaceholder = plh;
    this.stateChanges.next();
  }
  private ePlaceholder = '';
  public focused = false;
  public touched = false;
  onTouched = () => {};
  onChange = (_: any) => {};
  /**
   * Gets the empty status
   *
   * @returns if an option is selected
   */
  get empty() {
    return !!this.selected.value;
  }

  /**
   * Indicates whether the label should be in the floating position
   *
   * @returns whether the label should be in the floating position
   */
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  /**
   * Indicates whether the field is required
   *
   * @returns whether the field is required
   */
  @Input()
  get required() {
    return this.isRequired;
  }

  /**
   * Sets whether the field is required
   */
  set required(req) {
    this.isRequired = coerceBooleanProperty(req);
    this.stateChanges.next();
  }
  private isRequired = false;

  /**
   * Indicates whether the field is disabled
   *
   * @returns whether the field is disabled
   */
  @Input()
  get disabled(): boolean {
    return this.isDisabled;
  }

  /** Sets whether the field is disabled */
  set disabled(value: boolean) {
    this.isDisabled = coerceBooleanProperty(value);
    if (this.isDisabled) this.selected.disable();
    else this.selected.enable();
    this.stateChanges.next();
  }
  private isDisabled = false;

  /**
   * Indicates wheater the input is in an error state
   *
   * @returns wheater the input is in an error state
   */
  get errorState(): boolean {
    return this.selected.invalid && this.touched;
  }

  public controlType = 'safe-paginated-dropdown';

  @Input('aria-describedby') userAriaDescribedBy!: string;

  /**
   * Sets element ids that should be used for the aria-describedby attribute of your control
   *
   * @param ids id array
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.safe-paginated-dropdown-container'
    );
    if (!controlElement) return;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  /**
   * Handles mouse click on container
   *
   * @param event Mouse event
   */
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
  }

  /**
   * ControlValueAccessor set value
   *
   * @param val new value
   */
  writeValue(val: string | null): void {
    this.value = val;
  }

  /**
   * Registers new onChange function
   *
   * @param fn onChange function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Registers new onTouched function
   *
   * @param fn onTouched function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public selected: FormControl;

  /** The wanted query */
  @Input('query') queryName!: AvailableQueries;
  public query = AVAILABLE_QUERIES[this.queryName]?.query;
  public label = AVAILABLE_QUERIES[this.queryName]?.label;

  public selectedElement: any;
  private elements = new BehaviorSubject<any[]>([]);
  public elements$!: Observable<any[]>;
  private queryRef!: QueryRef<any>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  public loading = true;

  @ViewChild(MatSelect) elementSelect?: MatSelect;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   * @param fb shared FormBuilder service
   * @param elementRef shared elementref service
   * @param formField MatFormField
   * @param ngControl form control shared service
   */
  constructor(
    private apollo: Apollo,
    private fb: FormBuilder,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    this.selected = fb.control('');
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.query = AVAILABLE_QUERIES[this.queryName].query;
    this.label = AVAILABLE_QUERIES[this.queryName].label;
    this.queryRef = this.apollo.watchQuery<any>({
      query: this.query,
      variables: {
        first: ITEMS_PER_PAGE,
      },
    });

    this.elements$ = this.elements.asObservable();
    this.queryRef.valueChanges.subscribe((res) => {
      this.elements.next(
        get(res.data, this.queryName).edges.map((x: any) => x.node)
      );
      this.pageInfo = get(res.data, this.queryName).pageInfo;
      this.loading = res.loading;
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  /**
   * Handles focus on input
   *
   * @param event The focus event
   */
  onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * Handles lost focus on input
   *
   * @param event The focus event
   */
  onFocusOut(event: FocusEvent) {
    if (
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
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
   * Fetches more resources on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.queryRef.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              this.loading = false;
              return prev;
            }
            if (this.selectedElement) {
              if (
                get(fetchMoreResult, this.queryName).edges.find(
                  (x: any) => x.node.id === this.selectedElement?.id
                )
              ) {
                this.selectedElement = null;
              }
            }
            this.loading = fetchMoreResult.loading;
            return Object.assign({}, prev, {
              [this.queryName]: {
                edges: [
                  ...get(prev, this.queryName).edges,
                  ...get(fetchMoreResult, this.queryName).edges,
                ],
                pageInfo: get(fetchMoreResult, this.queryName).pageInfo,
                totalCount: get(fetchMoreResult, this.queryName).totalCount,
              },
            });
          },
        });
      }
    }
  }
}
