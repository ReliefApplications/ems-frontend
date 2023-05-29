import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ContentChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectOptionComponent } from './components/select-option.component';
import {
  Observable,
  Subject,
  Subscription,
  merge,
  startWith,
  takeUntil,
} from 'rxjs';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';

/**
 * UI Select Menu component
 */
@Component({
  selector: 'ui-select-menu',
  templateUrl: './select-menu.component.html',
  styleUrls: ['./select-menu.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMenuComponent),
      multi: true,
    },
  ],
})
export class SelectMenuComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  // Tells if the select menu should allow multi selection
  @Input() multiselect = false;
  // Tells if the select menu should be disabled
  @Input() disabled = false;
  // Default selected value
  @Input() value?: string | string[];
  // Any custom template provided for display
  @Input()
  customTemplate!: { template: TemplateRef<any>; context: any };

  // Emits when the list is opened
  @Output() opened = new EventEmitter<void>();
  // Emits when the list is closed
  @Output() closed = new EventEmitter<void>();
  // Emits the list of the selected options
  @Output() selectedOption = new EventEmitter<string | string[]>();

  @ContentChildren(SelectOptionComponent, { descendants: true })
  optionList!: QueryList<SelectOptionComponent>;

  @ViewChild('optionPanel', { static: true }) optionPanel!: TemplateRef<any>;

  // Array to store the values selected
  public selectedValues: any[] = [];
  // True if the box is focused, false otherwise
  public listBoxFocused = false;
  // Text to be displayed in the trigger when some selections are made
  public displayTrigger = '';
  public isGraphQlSelect = false;

  private destroy$ = new Subject<void>();
  private clickOutsideListener!: any;
  private selectClosingActionsSubscription!: Subscription;
  private overlayRef!: OverlayRef;
  private document: Document;

  //Control access value functions
  onChange!: (value: any) => void;
  onTouch!: () => void;

  /**
   * Ui Select constructor
   *
   * @param el Host element reference
   * @param renderer Renderer2
   * @param viewContainerRef ViewContainerRef
   * @param overlay Overlay
   * @param document document
   */
  constructor(
    public el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    @Inject(DOCUMENT) document: Document
  ) {
    this.document = document;
  }

  ngAfterViewInit(): void {
    this.clickOutsideListener = this.renderer.listen(
      window,
      'click',
      (event) => {
        if (
          !(
            this.el.nativeElement.contains(event.target) ||
            this.document.getElementById('optionList')?.contains(event.target)
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
          if (this.value) {
            this.selectedValues.push(
              this.value instanceof Array ? [...this.value] : this.value
            );
          }
          options.forEach((option) => {
            option.optionClick.pipe(takeUntil(this.destroy$)).subscribe({
              next: (isSelected: boolean) => {
                this.updateSelectedValues(option, isSelected);
                this.onChangeFunction();
              },
            });
            // Initialize any selected values
            if (this.selectedValues.includes(option.value)) {
              option.selected = true;
            } else {
              option.selected = false;
            }
            this.setDisplayTriggerText();
          });
        },
      });
  }

  /**
   * Write new value
   *
   * @param value value set from parent form control
   */
  writeValue(value: string[]): void {
    if (value && typeof value === 'string') {
      this.selectedValues = [value];
    } else if (value) {
      this.selectedValues = [...value];
    }
  }

  /**
   * Record on change
   *
   * @param fn
   * event that took place
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * Record on touch
   *
   * @param fn
   * event that took place
   */
  registerOnTouched(fn: any) {
    this.onTouch = fn;
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
    if (labelValues?.length) {
      if (!this.customTemplate) {
        if (labelValues.length === 1) {
          this.displayTrigger = labelValues[0];
        } else if (labelValues.length >= 1) {
          this.displayTrigger =
            labelValues[0] + ' (+' + (labelValues.length - 1) + ' others)';
        } else {
          this.displayTrigger = '';
        }
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

  ngOnDestroy(): void {
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Map select option list label if exists, otherwise value
   *
   * @param selectedValues selected values
   * @returns mapped values
   */
  getValuesLabel(selectedValues: any[]) {
    let values = this.optionList.filter((val: any) => {
      if (selectedValues.includes(val.value)) {
        return val;
      }
    });
    return (values = values.map((val: any) => {
      if (val.label) {
        return val.label;
      } else {
        return val.value;
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
        setTimeout(() => {
          this.applySelectListDisplayAnimation(true);
        }, 0);
        // Subscribe to all actions that close the select (outside click, item click, any other overlay detach)
        this.selectClosingActionsSubscription = this.selectClosingActions()
          .pipe(takeUntil(this.destroy$))
          .subscribe(
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
    setTimeout(() => {
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
}
