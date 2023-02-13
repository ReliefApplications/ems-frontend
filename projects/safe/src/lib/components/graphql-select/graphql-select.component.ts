import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelect,
  MatSelectChange,
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
  NgControl,
  ControlValueAccessor,
  UntypedFormControl,
} from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../utils/update-queries';

/** A constant that is used to determine how many items should be added on scroll. */
const ITEMS_PER_RELOAD = 10;

/** Component for a dropdown with pagination */
@Component({
  selector: 'safe-graphql-select',
  templateUrl: './graphql-select.component.html',
  styleUrls: ['./graphql-select.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MatFormFieldControl,
      useExisting: SafeGraphQLSelectComponent,
    },
  ],
})
export class SafeGraphQLSelectComponent
  extends SafeUnsubscribeComponent
  implements
    OnInit,
    OnChanges,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string | string[]>
{
  static nextId = 0;

  @Input() valueField = '';
  @Input() textField = '';
  @Output() selectionChange = new EventEmitter<string | string[] | null>();

  @Input() filterable = false;
  @Output() searchChange = new EventEmitter<string>();
  public searchControl = new UntypedFormControl('');

  /**
   * Gets the value
   *
   * @returns the value
   */
  @Input() get value(): string | string[] | null {
    return this.ngControl.value;
  }

  /** Sets the value */
  set value(val: string | string[] | null) {
    this.onChange(val);
    this.stateChanges.next();
    this.selectionChange.emit(val);
  }

  public stateChanges = new Subject<void>();
  @HostBinding()
  id = `safe-graphql-select-${SafeGraphQLSelectComponent.nextId++}`;

  /**
   * Gets the placeholder for the select
   *
   * @returns the placeholder
   */
  @Input() get placeholder() {
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (_: any) => {};

  /**
   * Gets the empty status
   *
   * @returns if an option is selected
   */
  get empty() {
    // return !this.selected.value;
    return !this.ngControl.control?.value;
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
    return this.ngControl.disabled || false;
  }

  /** Sets whether the field is disabled */
  set disabled(value: boolean) {
    const isDisabled = coerceBooleanProperty(value);
    if (isDisabled) this.ngControl.control?.disable();
    else this.ngControl.control?.enable();
    this.stateChanges.next();
  }

  /**
   * Indicates whether the input is in an error state
   *
   * @returns whether the input is in an error state
   */
  get errorState(): boolean {
    return (this.ngControl.invalid && this.touched) || false;
    // return this.ngControl.invalid && this.touched;
    // return this.selected.invalid && this.touched;
  }

  public controlType = 'safe-graphql-select';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy!: string;

  /**
   * Sets element ids that should be used for the aria-describedby attribute of your control
   *
   * @param ids id array
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.safe-graphql-select-container'
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

  // public selected: FormControl;

  /** Query reference for getting the available contents */
  @Input() query!: QueryRef<any>;

  private queryName!: string;
  @Input() path = '';
  @Input() selectedElements: any[] = [];
  public elements = new BehaviorSubject<any[]>([]);
  public elements$!: Observable<any[]>;
  private queryElements: any[] = [];
  private cachedElements: any[] = [];
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
   * @param elementRef shared element ref service
   * @param formField MatFormField
   * @param ngControl form control shared service
   */
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.elements$ = this.elements.asObservable();
    this.query.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        this.queryName = Object.keys(data)[0];
        this.updateValues(data, loading);
      });
    this.ngControl.valueChanges
      ?.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const elements = this.elements.getValue();
        if (Array.isArray(value)) {
          this.selectedElements = [
            ...elements.filter((element) => {
              value.find((x) => x === element[this.valueField]);
            }),
          ];
        } else {
          this.selectedElements = [
            elements.find((element) => value === element[this.valueField]),
          ];
        }
        this.selectionChange.emit(value);
      });
    // this way we can wait for 0.5s before sending an update
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        this.cachedElements = [];
        this.searchChange.emit(value);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // check if the query has changed
    // if so, reset the loading and pageInfo states
    if (changes.query) {
      this.loading = true;
      this.pageInfo = {
        endCursor: '',
        hasNextPage: true,
      };
    }

    const elements = this.elements.getValue();
    const selectedElements = this.selectedElements.filter(
      (selectedElement) =>
        selectedElement &&
        !elements.find(
          (node) => node[this.valueField] === selectedElement[this.valueField]
        )
    );
    this.elements.next([...selectedElements, ...elements]);
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  /**
   * Handles focus on input
   */
  onFocusIn() {
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
      this.focused &&
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
        this.query
          .fetchMore({
            variables: {
              first: ITEMS_PER_RELOAD,
              afterCursor: this.pageInfo.endCursor,
            },
          })
          .then((results) => {
            this.updateValues(results.data, results.loading);
          });
      }
    }
  }

  /**
   * Triggers on selection change for select
   *
   * @param event the selection change event
   */
  public onSelectionChange(event: MatSelectChange) {
    this.value = event.value;
  }

  /** Triggers on close of select */
  onCloseSelect() {
    // filter out from the elements the ones that are
    // not in the queryElements array or the selectedElements array
    const elements = this.elements
      .getValue()
      .filter(
        (element) =>
          this.queryElements.find(
            (queryElement) =>
              queryElement[this.valueField] === element[this.valueField]
          ) ||
          this.selectedElements.find(
            (selectedElement) =>
              selectedElement[this.valueField] === element[this.valueField]
          )
      );

    this.elements.next(elements);
  }

  /**
   * Update data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(data: any, loading: boolean) {
    const path = this.path ? `${this.queryName}.${this.path}` : this.queryName;
    const elements: any[] = get(data, path).edges
      ? get(data, path).edges.map((x: any) => x.node)
      : get(data, path);
    const selectedElements = this.selectedElements.filter(
      (selectedElement) =>
        selectedElement &&
        !elements.find(
          (node) => node[this.valueField] === selectedElement[this.valueField]
        )
    );
    this.cachedElements = updateQueryUniqueValues(this.cachedElements, [
      ...selectedElements,
      ...elements,
    ]);
    this.elements.next(this.cachedElements);
    this.queryElements = this.cachedElements;
    this.pageInfo = get(data, path).pageInfo;
    this.loading = loading;
  }
}
