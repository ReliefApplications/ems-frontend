import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Inject,
  AfterContentInit,
  Optional,
  Self,
  ContentChildren,
  QueryList,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Observable, Subject, Subscription, merge, takeUntil } from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { isNil } from 'lodash';
import { SelectOptionComponent } from './components/select-option.component';

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
  implements ControlValueAccessor, AfterContentInit, OnDestroy
{
  /** Tells if the select menu should allow multi selection */
  @Input() multiselect = false;
  // Tells if the select menu should be disabled
  @Input() disabled = false;
  /** Tells if some styles to the current ul element should be applied */
  @Input() isGraphQlSelect = false;
  /** Default selected value */
  @Input() value?: string | string[] | null;
  /** Any custom template provided for display */
  @Input()
  customTemplate!: { template: TemplateRef<any>; context: any };
  /** Add extra classes that will apply to the wrapper element */
  @Input() extraClasses?: string;
  /** Default value to be displayed when no option is selected */
  @Input() placeholder = '';

  // Emits when the list is opened
  @Output() opened = new EventEmitter<void>();
  // Emits when the list is closed
  @Output() closed = new EventEmitter<void>();
  // Emits the list of the selected options
  @Output() selectedOption = new EventEmitter<string | string[]>();

  /** List of SelectOptionComponent descendants. */
  @ContentChildren(SelectOptionComponent, { descendants: true })
  options!: QueryList<SelectOptionComponent>;

  @ViewChild('optionPanel', { static: true }) optionPanel!: TemplateRef<any>;

  /** Array to store the values selected */
  public selectedValues: any[] = [];
  /** True if the box is focused, false otherwise */
  public listBoxFocused = false;
  /** Text to be displayed in the trigger when some selections are made */
  public displayTrigger = this.placeholder;

  private destroy$ = new Subject<void>();
  private clickOutsideListener!: () => void;
  private selectOptionListener!: () => void;
  private selectClosingActionsSubscription!: Subscription;
  private overlayRef!: OverlayRef;

  private overlayTimeoutListener!: NodeJS.Timeout;
  private applyAnimationTimeoutListener!: NodeJS.Timeout;

  /** Control access value functions */
  onChange!: (value: any) => void;
  onTouch!: () => void;

  /**
   * Return current option list html elements
   *
   * @returns list option as html elements
   */
  get currentOptionList() {
    return this.document.getElementById('selectList')?.querySelectorAll('li');
  }

  /**
   * Get options
   *
   * @returns all the options that are not parent group
   */
  getNotGroupOptionList = () =>
    this.options
      ? (this.options as QueryList<SelectOptionComponent>).filter(
          (option: SelectOptionComponent) => !option.isGroup
        )
      : [];

  /**
   * Ui Select constructor
   *
   * @param control host element NgControl instance
   * @param el Host element reference
   * @param renderer Renderer2
   * @param viewContainerRef ViewContainerRef
   * @param overlay Overlay
   * @param document document
   */
  constructor(
    @Optional() @Self() private control: NgControl,
    public el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (this.control) {
      this.control.valueAccessor = this;
    }
  }

  ngAfterContentInit(): void {
    this.clickOutsideListener = this.renderer.listen(
      window,
      'click',
      (event) => {
        if (
          !(
            this.el.nativeElement.contains(event.target) ||
            this.document.getElementById('selectList')?.contains(event.target)
          )
        ) {
          this.closeSelectPanel();
        }
      }
    );
    if (this.control) {
      this.control.valueChanges?.pipe(takeUntil(this.destroy$)).subscribe({
        next: (value) => {
          // If the value is cleared from outside, reset displayed values
          if (isNil(value) || value.length === 0) {
            this.selectedValues = [];
            this.getNotGroupOptionList().forEach((option) => {
              option.selected = false;
            });
            this.setDisplayTriggerText();
          }
        },
      });
    }
    if (this.value) {
      this.selectedValues.push(
        this.value instanceof Array ? [...this.value] : this.value
      );
    }
    if (this.selectedValues) {
      this.setDisplayTriggerText();
      this.getNotGroupOptionList().forEach((option: SelectOptionComponent) => {
        if (!this.selectedValues.includes(option.value)) {
          option.selected = false;
        } else {
          option.selected = true;
        }
      });
    }
  }

  /**
   * Write new value
   *
   * @param value value set from parent form control
   */
  writeValue(value: string | string[] | null): void {
    if (value && value instanceof Array) {
      this.selectedValues = [...value];
    } else if (value) {
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
        this.onChange(this.selectedValues[0]);
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
   * @param selectedOption option clicked
   * @param selectedOption.value value of option clicked
   * @param {boolean} selected if the option as selected or unselected
   */
  private updateSelectedValues(
    selectedOption: { value: any },
    selected: boolean
  ): void {
    if (selected) {
      if (!this.multiselect) {
        this.selectedValues = [selectedOption.value];
      } else {
        this.selectedValues = [...this.selectedValues, selectedOption.value];
      }
      this.getNotGroupOptionList().forEach((option: SelectOptionComponent) => {
        if (!this.selectedValues.includes(option.value)) {
          option.selected = false;
        } else {
          option.selected = true;
        }
      });
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
    const values = this.getNotGroupOptionList().filter(
      (val: SelectOptionComponent) => selectedValues.includes(val.value)
    );
    return values.map((val: SelectOptionComponent) => {
      return val.label;
    });
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
        this.selectClosingActionsSubscription = this.selectClosingActions()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            // If so, destroy select
            () => this.closeSelectPanel()
          );
        // Listeners to get the selected option
        if (this.selectOptionListener) {
          this.selectOptionListener();
        }
        this.selectOptionListener = this.renderer.listen(
          this.document.getElementById('selectList'),
          'click',
          (event: any) => {
            const isGroup = JSON.parse(
              event.target.getAttribute('data-is-group')
            );
            const isDisabled = JSON.parse(
              event.target.getAttribute('data-is-disabled')
            );
            if (!isGroup && !isDisabled) {
              const optionValue = JSON.parse(
                event.target.getAttribute('data-value')
              );
              const isSelected = JSON.parse(
                event.target.getAttribute('data-selected')
              );
              this.updateSelectedValues({ value: optionValue }, isSelected);
              this.onChangeFunction();
            }
          }
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
    if (this.overlayTimeoutListener) {
      clearTimeout(this.overlayTimeoutListener);
    }
    this.overlayTimeoutListener = setTimeout(() => {
      this.overlayRef.detach();
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

  ngOnDestroy(): void {
    if (this.applyAnimationTimeoutListener) {
      clearTimeout(this.applyAnimationTimeoutListener);
    }
    if (this.overlayTimeoutListener) {
      clearTimeout(this.overlayTimeoutListener);
    }
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    if (this.selectOptionListener) {
      this.selectOptionListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
