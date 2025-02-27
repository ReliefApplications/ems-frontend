import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChildren,
  QueryList,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  AfterContentInit,
  Optional,
  Self,
  OnChanges,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { SelectOptionComponent } from './components/select-option.component';
import {
  Observable,
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  merge,
  startWith,
  takeUntil,
} from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { isNil } from 'lodash';
import { ShadowDomService } from '../shadow-dom/shadow-dom.service';

/**
 * UI Select Menu component
 * Select menu is a UI component that provides a list of options to choose from.
 */
@Component({
  selector: 'ui-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
})
export class SelectMenuComponent
  implements ControlValueAccessor, OnChanges, AfterContentInit, OnDestroy
{
  /** Tells if the select menu should allow multi selection */
  @Input() multiselect = false;
  /** Tells if the select menu should be disabled */
  @Input() disabled = false;
  /** Tells if some styles to the current ul element should be applied */
  @Input() isGraphQlSelect = false;
  /** If the option list is searchable or not */
  @Input() filterable = false;
  /** Default selected value */
  @Input() value?: string | string[] | null;
  /** Any custom template provided for display */
  @Input()
  customTemplate!: { template: TemplateRef<any>; context: any };
  /** Add extra classes that will apply to the wrapper element */
  @Input() extraClasses?: string;
  /** Default value to be displayed when no option is selected */
  @Input() placeholder = '';

  /** Emits when the list is opened */
  @Output() opened = new EventEmitter<void>();
  /** Emits when the list is closed */
  @Output() closed = new EventEmitter<void>();
  /** Emits the list of the selected options */
  @Output() selectedOption = new EventEmitter<string | string[]>();

  /** List of options */
  @ContentChildren(SelectOptionComponent, { descendants: true })
  optionList!: QueryList<SelectOptionComponent>;

  /** Template reference for the option panel */
  @ViewChild('optionPanel', { static: true }) optionPanel!: TemplateRef<any>;

  /** Search control */
  public searchControl = new FormControl('', { nonNullable: true });
  /** Loading state */
  @Input() public loading = false;
  /** Subscription to the search control */
  private searchSubscriptionActive!: Subscription;
  /** handles resetting subscriptions */
  public resetSubscriptions$ = new Subject<void>();

  /** Array to store the values selected */
  public selectedValues: any[] = [];
  /** True if the box is focused, false otherwise */
  public listBoxFocused = false;
  /** Text to be displayed in the trigger when some selections are made */
  public displayTrigger = this.placeholder;
  /** Needed property for the components in survey that would use the select-menu component */
  public triggerUIChange$ = new Subject<boolean>();
  /** Destroy subject */
  private destroy$ = new Subject<void>();
  /** Click outside listener */
  private clickOutsideListener!: () => void;
  /** Subscription to the closing actions */
  private selectClosingActionsSubscription!: Subscription;
  /** Overlay reference */
  private overlayRef!: OverlayRef;
  /** Timeout listener for the animation */
  private applyAnimationTimeoutListener!: NodeJS.Timeout;
  /** Timeout listener for the closing of the panel */
  private closePanelTimeoutListener!: NodeJS.Timeout;

  /** Control access value functions */
  onChange!: (value: any) => void;
  /** Control access touch functions */
  onTouch!: () => void;

  /** @returns if current option list is empty by option number or option display number by search */
  get emptyList() {
    return (
      this.optionList.toArray().every((option) => !option.display) ||
      !this.optionList.length
    );
  }

  /**
   * Ui Select constructor
   *
   * @param control host element NgControl instance
   * @param el Host element reference
   * @param renderer Renderer2
   * @param viewContainerRef ViewContainerRef
   * @param overlay Overlay
   * @param shadowDomService shadow dom service to handle the current host of the component
   */
  constructor(
    @Optional() @Self() private control: NgControl,
    public el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    private shadowDomService: ShadowDomService
  ) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngOnChanges(): void {
    // Listen to search bar changes if filterable is available
    if (this.filterable) {
      if (this.searchSubscriptionActive) {
        this.searchSubscriptionActive.unsubscribe();
      }
      this.searchSubscriptionActive = this.searchControl.valueChanges
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe((searchValue: string) => {
          this.filterOptionList(searchValue);
        });
    }
  }

  ngAfterContentInit(): void {
    this.clickOutsideListener = this.renderer.listen(
      this.shadowDomService.currentHost,
      'click',
      (event) => {
        if (
          !(
            this.el.nativeElement.contains(event.target) ||
            this.shadowDomService.currentHost
              .getElementById('optionsContainer')
              ?.contains(event.target)
          )
        ) {
          this.closeSelectPanel();
        }
      }
    );
    this.optionList?.changes
      .pipe(startWith(this.optionList), takeUntil(this.destroy$))
      .subscribe({
        next: (options: QueryList<SelectOptionComponent>) => {
          this.handleOptionsQueryChange(options);
        },
      });
    if (this.control) {
      this.control.valueChanges?.pipe(takeUntil(this.destroy$)).subscribe({
        next: (value) => {
          // If the value is cleared from outside, reset displayed values
          if (isNil(value) || value.length === 0) {
            this.selectedValues = [];
            this.optionList.forEach((option) => (option.selected = false));
            this.setDisplayTriggerText();
          }
        },
      });
    }
  }

  /**
   * Force the options list when they cannot be successfully loaded through contentchildren
   *
   * @param optionList the optionList we want to
   */
  forceOptionList(optionList: QueryList<SelectOptionComponent>) {
    this.optionList = optionList;
    this.optionList?.changes
      .pipe(startWith(this.optionList), takeUntil(this.destroy$))
      .subscribe({
        next: (options: QueryList<SelectOptionComponent>) => {
          this.handleOptionsQueryChange(options);
        },
      });
  }

  /**
   * Update selected values and all handlers for the given options query list
   *
   * @param options Select menu options query list items
   */
  private handleOptionsQueryChange(options: QueryList<SelectOptionComponent>) {
    if (!isNil(this.value)) {
      this.selectedValues.push(
        this.value instanceof Array ? [...this.value] : this.value
      );
    }
    options.forEach((option) => {
      option.optionClick
        .pipe(takeUntil(this.destroy$), takeUntil(this.resetSubscriptions$))
        .subscribe({
          next: (isSelected: boolean) => {
            this.updateSelectedValues(option, isSelected);
            this.onChangeFunction();
          },
        });
      // Initialize any selected values
      if (this.selectedValues.find((selVal) => selVal == option.value)) {
        option.selected = true;
      } else {
        option.selected = false;
      }
      this.setDisplayTriggerText();
    });
  }

  /** Reset subscriptions */
  resetSubscriptions() {
    this.resetSubscriptions$.next();
  }

  /**
   * Write new value
   *
   * @param value value set from parent form control
   */
  writeValue(value: string | string[] | null): void {
    if (value && value instanceof Array) {
      this.selectedValues = [...value];
    } else if (!isNil(value)) {
      this.selectedValues = [value];
    }
  }

  /**
   * Record on change
   *
   * @param fn
   * event that took place
   */
  registerOnChange(fn: (value: any) => void) {
    if (!this.onChange) {
      this.onChange = fn;
    }
  }

  /**
   * Record on touch
   *
   * @param fn
   * event that took place
   */
  registerOnTouched(fn: () => void) {
    if (!this.onTouch) {
      this.onTouch = fn;
    }
  }

  /**
   * Set disabled state of the control
   *
   * @param isDisabled is control disabled
   */
  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Emit selectedOption output, change trigger text and deal with control access value when an element of the list is clicked
   */
  onChangeFunction() {
    // Emit the list of values selected as an output
    this.setDisplayTriggerText();
    if (this.multiselect) {
      // Manage control access value
      if (this.onChange && this.onTouch) {
        this.onChange(this.selectedValues);
        this.onTouch();
      }
      this.selectedOption.emit(this.selectedValues);
    } else {
      // Manage control access value
      if (this.onChange && this.onTouch) {
        if (Array.isArray(this.selectedValues)) {
          this.onChange(this.selectedValues[0]);
        }
        this.onTouch();
      }
      this.selectedOption.emit(this.selectedValues[0]);
      //close list after selection
      this.closeSelectPanel();
    }
  }

  /** Builds the text displayed from selected options */
  private setDisplayTriggerText() {
    const labelValues = this.getValuesLabel(this.selectedValues);
    // Adapt the text to be displayed in the trigger if no custom template for display is provided
    if (!this.customTemplate) {
      if (labelValues?.length) {
        if (labelValues.length === 1) {
          this.displayTrigger = labelValues[0];
        } else {
          this.displayTrigger =
            labelValues[0] + ' (+' + (labelValues.length - 1) + ' others)';
        }
      } else {
        this.displayTrigger = '';
      }
    }
  }

  /**
   * Updated the form control value on optionClick event
   *
   * @param {SelectOptionComponent} selectedOption option clicked
   * @param {boolean} selected if the option as selected or unselected
   */
  private updateSelectedValues(
    selectedOption: SelectOptionComponent,
    selected: boolean
  ): void {
    if (selected) {
      if (!this.multiselect) {
        // Reset any other selected option
        this.optionList.forEach((option: SelectOptionComponent) => {
          if (selectedOption.value !== option.value) {
            option.selected = false;
          }
        });
        this.selectedValues = [selectedOption.value];
      } else {
        this.selectedValues = [...this.selectedValues, selectedOption.value];
      }
    } else {
      const index = this.selectedValues?.indexOf(selectedOption.value) ?? 0;
      this.selectedValues?.splice(index, 1);
    }
  }

  /**
   * Map select option list label if exists, otherwise value
   *
   * @param selectedValues selected values
   * @returns mapped values
   */
  getValuesLabel(selectedValues: any[]) {
    let values = this.optionList.filter((option: any) => {
      for (const value of selectedValues) {
        if (value == option.value) {
          return option;
        }
      }
    });
    return (values = values.map((x: any) => {
      if (x.label) {
        return x.label;
      } else {
        return x.value;
      }
    }));
  }

  // SELECT DISPLAY LOGIC //
  /**
   * Opens or closes the list when the trigger component is clicked (+ make the corresponding output emissions)
   */
  openSelectPanel() {
    //Do nothing if the box is disabled
    if (this.disabled) {
      return;
    }
    // Open the box + emit outputs
    if (this.listBoxFocused) {
      this.closeSelectPanel();
    }
    //Close the box + emit outputs
    else {
      if (!this.listBoxFocused) {
        this.listBoxFocused = true;
        // We create an overlay for the displayed select as done for UI menu
        this.overlayRef = this.overlay.create({
          hasBackdrop: false,
          // close autocomplete on user scroll - default behavior, could be changed
          scrollStrategy: this.overlay.scrollStrategies.close(),
          // We position the displayed autocomplete taking current directive host element as reference
          positionStrategy: this.overlay
            .position()
            .flexibleConnectedTo(
              this.el.nativeElement.parentElement ?? this.el.nativeElement
            )
            .withPositions([
              {
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top',
                offsetX: 0,
                offsetY: 5,
              },
              {
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom',
                offsetX: 0,
                offsetY: -5,
              },
            ]),
          minWidth:
            this.el.nativeElement.parentElement?.clientWidth &&
            this.el.nativeElement.parentElement?.clientWidth !== 0
              ? this.el.nativeElement.parentElement?.clientWidth
              : this.el.nativeElement.clientWidth,
        });
        // Create the template portal for the select items using the reference of the element with the select directive
        const templatePortal = new TemplatePortal(
          this.optionPanel,
          this.viewContainerRef
        );
        // Attach it to our overlay
        this.overlayRef.attach(templatePortal);
        // We add the needed classes to create the animation on select display
        if (this.applyAnimationTimeoutListener) {
          clearTimeout(this.applyAnimationTimeoutListener);
        }
        this.applyAnimationTimeoutListener = setTimeout(() => {
          this.applySelectListDisplayAnimation(true);
        }, 0);
        // Subscribe to all actions that close the select (outside click, item click, any other overlay detach)
        this.selectClosingActionsSubscription =
          this.selectClosingActions().subscribe(
            // If so, destroy select
            () => this.closeSelectPanel()
          );
        this.opened.emit();
      }
    }
  }

  /** Closes the listbox if a click is made outside of the component */
  private closeSelectPanel() {
    if (!this.overlayRef || !this.listBoxFocused) {
      return;
    }
    // Unsubscribe to our close action subscription
    this.selectClosingActionsSubscription.unsubscribe();
    this.listBoxFocused = false;
    this.closed.emit();
    // We remove the needed classes to create the animation on select close
    this.applySelectListDisplayAnimation(false);
    // Detach the previously created overlay for the select
    if (this.closePanelTimeoutListener) {
      clearTimeout(this.closePanelTimeoutListener);
    }
    this.closePanelTimeoutListener = setTimeout(() => {
      this.overlayRef.detach();
      this.searchControl.setValue('');
      this.triggerUIChange$.next(true);
    }, 100);
  }

  /**
   * Actions linked to the destruction of the current displayed select
   *
   * @returns Observable of actions
   */
  private selectClosingActions(): Observable<Event | void> {
    const detachment$ = this.overlayRef.detachments();
    return merge(detachment$);
  }

  /**
   * Apply animation to displayed selectList
   *
   * @param toDisplay If the selectList is going to be displayed or not
   */
  private applySelectListDisplayAnimation(toDisplay: boolean) {
    // The overlayElement is the immediate parent element containing the selectList list,
    // therefor we want the immediate child in where we would apply the classes
    const selectList = this.overlayRef.overlayElement.querySelector('div');
    if (toDisplay) {
      this.renderer.addClass(selectList, 'translate-y-0');
      this.renderer.addClass(selectList, 'opacity-100');
    } else {
      this.renderer.removeClass(selectList, 'translate-y-0');
      this.renderer.removeClass(selectList, 'opacity-100');
    }
  }

  /**
   * Filter the current option list by the given search value
   *
   * @param searchValue value to filter current option list
   */
  private filterOptionList(searchValue: string) {
    this.loading = true;
    // Recursively set option display input, based on if the option is a group or not
    const setOptionVisibility = (options: QueryList<SelectOptionComponent>) => {
      options.forEach((option) => {
        if (option.options.length) {
          setOptionVisibility(option.options);
          option.display = option.options.toArray().some((o) => o.display);
        } else {
          const regExTest = new RegExp(searchValue, 'gmi');
          if (regExTest.test(option.label)) {
            option.display = true;
          } else {
            option.display = false;
          }
        }
      });
    };
    setOptionVisibility(this.optionList);
    this.loading = false;
    this.triggerUIChange$.next(true);
  }

  ngOnDestroy(): void {
    if (this.applyAnimationTimeoutListener) {
      clearTimeout(this.applyAnimationTimeoutListener);
    }
    if (this.closePanelTimeoutListener) {
      clearTimeout(this.closePanelTimeoutListener);
    }
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    if (this.selectClosingActionsSubscription) {
      this.selectClosingActionsSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
