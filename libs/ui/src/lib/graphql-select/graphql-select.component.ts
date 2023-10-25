import {
  ChangeDetectorRef,
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
  Renderer2,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { QueryRef } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { get } from 'lodash';
import { NgControl, ControlValueAccessor, FormControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { updateQueryUniqueValues } from './utils/update-queries';
import { DOCUMENT } from '@angular/common';

/** A constant that is used to determine how many items should be added on scroll. */
const ITEMS_PER_RELOAD = 10;

/** Component for a dropdown with pagination */
@Component({
  selector: 'ui-graphql-select',
  templateUrl: './graphql-select.component.html',
  styleUrls: ['./graphql-select.component.scss'],
})
export class GraphQLSelectComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  static nextId = 0;

  @Input() valueField = '';
  @Input() textField = '';
  @Input() path = '';
  @Input() isSurveyQuestion = false;
  /** Add type to selectedElements */
  @Input() selectedElements: any[] = [];
  @Input() filterable = false;
  @Input() placeholder = '';
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy!: string;
  /** Query reference for getting the available contents */
  @Input() query!: QueryRef<any>;

  /**
   * Gets the value
   *
   * @returns the value
   */
  @Input() get value(): string | string[] | null {
    return this.ngControl?.value;
  }

  /** Sets the value */
  set value(val: string | string[] | null) {
    this.onChange(val);
    this.stateChanges.next();
    this.selectionChange.emit(val);
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

  /**
   * Indicates whether the field is disabled
   *
   * @returns whether the field is disabled
   */
  @Input()
  get disabled(): boolean {
    return this.ngControl?.disabled || false;
  }

  /** Sets whether the field is disabled */
  set disabled(value: boolean) {
    const isDisabled = coerceBooleanProperty(value);
    if (isDisabled) this.ngControl?.control?.disable();
    else this.ngControl?.control?.enable();
    this.stateChanges.next();
  }

  @Output() selectionChange = new EventEmitter<string | string[] | null>();
  @Output() searchChange = new EventEmitter<string>();

  public stateChanges = new Subject<void>();
  public searchControl = new FormControl('', { nonNullable: true });
  public controlType = 'ui-graphql-select';
  public elements = new BehaviorSubject<any[]>([]);
  public elements$!: Observable<any[]>;
  public loading = true;
  public focused = false;
  public touched = false;

  private destroy$ = new Subject<void>();
  private queryName!: string;
  private queryChange$ = new Subject<void>();
  private queryElements: any[] = [];
  private cachedElements: any[] = [];
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private isRequired = false;
  private scrollListener!: any;

  @ViewChild(SelectMenuComponent) elementSelect!: SelectMenuComponent;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  /**
   * Indicates whether the label should be in the floating position
   *
   * @returns whether the label should be in the floating position
   */
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @HostBinding()
  id = `ui-graphql-select-${GraphQLSelectComponent.nextId++}`;

  /**
   * Gets the empty status
   *
   * @returns if an option is selected
   */
  get empty() {
    // return !this.selected.value;
    return !this.ngControl?.control?.value;
  }

  /**
   * Indicates whether the input is in an error state
   *
   * @returns whether the input is in an error state
   */
  get errorState(): boolean {
    return (this.ngControl?.invalid && this.touched) || false;
    // return this.ngControl.invalid && this.touched;
    // return this.selected.invalid && this.touched;
  }

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param ngControl form control shared service,
   * @param elementRef shared element ref service
   * @param renderer - Angular - Renderer2
   * @param changeDetectorRef - Angular - ChangeDetectorRef
   * @param document document
   */
  constructor(
    @Optional() @Self() public ngControl: NgControl,
    public elementRef: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  /**
   * Sets element ids that should be used for the aria-describedby attribute of your control
   *
   * @param ids id array
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.ui-graphql-select-container'
    );
    if (!controlElement) return;
    this.renderer.setAttribute(
      controlElement,
      'aria-describedby',
      ids.join(' ')
    );
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
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers new onTouched function
   *
   * @param fn onTouched function
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onChange = (_: any) => {};

  ngOnInit(): void {
    this.elements$ = this.elements.asObservable();
    if (this.query) {
      this.query.valueChanges
        .pipe(takeUntil(this.queryChange$), takeUntil(this.destroy$))
        .subscribe(({ data, loading }) => {
          this.queryName = Object.keys(data)[0];
          this.updateValues(data, loading);
        });
    }
    this.ngControl?.valueChanges
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
    if (changes['query'] && changes['query'].previousValue) {
      // Unsubscribe from the old query
      this.queryChange$.next();

      // Reset the loading and pageInfo states
      this.loading = true;
      this.pageInfo = {
        endCursor: '',
        hasNextPage: true,
      };

      // Clear the cached elements
      this.cachedElements = [];

      // Clear the selected elements
      this.selectedElements = [];

      // Clear the elements
      this.elements.next([]);

      // Clear the search control
      this.searchControl.setValue('');

      // Clear the form control
      this.ngControl?.control?.setValue(null);

      // Emit the selection change
      this.selectionChange.emit(null);

      // Subscribe to the new query
      this.query.valueChanges
        .pipe(takeUntil(this.queryChange$), takeUntil(this.destroy$))
        .subscribe(({ data, loading }) => {
          this.queryName = Object.keys(data)[0];
          this.updateValues(data, loading);
        });
    } else {
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
  }

  ngOnDestroy(): void {
    if (this.scrollListener) {
      this.scrollListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
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
   * Adds scroll listener to select and focuses on input.
   *
   */
  onOpenSelect(): void {
    // focus on search input, if filterable
    if (this.filterable) this.searchInput?.nativeElement.focus();
    const panel = this.document.getElementById('optionList');
    if (this.scrollListener) {
      this.scrollListener();
    }
    this.scrollListener = this.renderer.listen(
      panel,
      'scroll',
      (event: any) => {
        this.loadOnScroll(event);
      }
    );
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
      if (!this.loading && this.pageInfo?.hasNextPage) {
        // Check if original query is using skip or afterCursor
        const queryDefinition = this.query.options.query.definitions[0];
        const isSkip =
          queryDefinition?.kind === 'OperationDefinition' &&
          !!queryDefinition.variableDefinitions?.find(
            (x) => x.variable.name.value === 'skip'
          );

        this.loading = true;
        this.query
          .fetchMore({
            variables: {
              first: ITEMS_PER_RELOAD,
              ...(isSkip
                ? { skip: this.cachedElements.length }
                : { afterCursor: this.pageInfo.endCursor }),
            },
          })
          .then((results) => {
            this.updateValues(results.data, results.loading);
          });
      }
      // If it's used as a survey question, then change detector have to be manually triggered
      if (this.isSurveyQuestion) {
        this.changeDetectorRef.detectChanges();
      }
    }
  }

  /**
   * Triggers on selection change for select
   *
   * @param event the selection change event
   */
  public onSelectionChange(event: any) {
    this.value = event.value;
    // If it's used as a survey question, then change detector have to be manually triggered
    if (this.isSurveyQuestion) {
      this.changeDetectorRef.detectChanges();
    }
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
    // If it's used as a survey question, then change detector have to be manually triggered
    if (this.isSurveyQuestion) {
      this.changeDetectorRef.detectChanges();
    }
  }

  /**
   * Returns the display value for the given element
   *
   * @param element the element to get the display value for
   * @returns the display value
   */
  public getDisplayValue(element: any) {
    return get(element, this.textField);
  }
}
