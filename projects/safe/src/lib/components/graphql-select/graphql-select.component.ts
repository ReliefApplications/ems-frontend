import {
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
} from '@angular/core';
import { QueryRef } from 'apollo-angular';
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
import { NgControl, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

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
  implements
    OnInit,
    OnDestroy,
    ControlValueAccessor,
    MatFormFieldControl<string | string[]>
{
  static nextId = 0;

  @Input() valueField = '';
  @Input() textField = '';
  @Input()
  @Output()
  selectionChange = new EventEmitter<string | string[] | null>();
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
  @Input('query') query!: QueryRef<any>;

  private queryName!: string;
  @Input() selectedElements: any[] = [];
  private elements = new BehaviorSubject<any[]>([]);
  public elements$!: Observable<any[]>;
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
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit(): void {
    this.elements$ = this.elements.asObservable();
    this.query.valueChanges.subscribe((res: any) => {
      this.queryName = Object.keys(res.data)[0];
      const nodes: any[] = get(res.data, this.queryName).edges
        ? get(res.data, this.queryName).edges.map((x: any) => x.node)
        : get(res.data, this.queryName);
      this.selectedElements = this.selectedElements.filter(
        (element) =>
          element &&
          !nodes.find(
            (node) => node[this.valueField] === element[this.valueField]
          )
      );
      this.elements.next([...this.selectedElements, ...nodes]);
      this.pageInfo = get(res.data, this.queryName).pageInfo;
      this.loading = res.loading;
    });
    this.ngControl.valueChanges?.subscribe((value) => {
      this.selectionChange.emit(value);
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
        this.query.fetchMore({
          variables: {
            first: ITEMS_PER_RELOAD,
            afterCursor: this.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              this.loading = false;
              return prev;
            }
            return Object.assign({}, prev, {
              [this.queryName]: {
                edges: [
                  ...(get(prev, this.queryName).edges
                    ? get(prev, this.queryName).edges
                    : get(prev, this.queryName)),
                  ...(get(fetchMoreResult, this.queryName).edges
                    ? get(fetchMoreResult, this.queryName).edges
                    : get(fetchMoreResult, this.queryName)),
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
