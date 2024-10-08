import {
  Directive,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  Renderer2,
  HostListener,
  AfterContentInit,
  OnDestroy,
  QueryList,
  Optional,
  Self,
  ViewContainerRef,
  Inject,
} from '@angular/core';
import { AutocompleteComponent } from './autocomplete.component';
import { isEqual } from 'lodash';
import { Observable, Subject, Subscription, merge, takeUntil } from 'rxjs';
import { OptionComponent } from './components/option.component';
import { NgControl } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ScrollStrategies } from './types/scroll-strategies';
import { DOCUMENT } from '@angular/common';

/**
 * UI Autocomplete directive
 */
@Directive({
  selector: '[uiAutocomplete]',
})
export class AutocompleteDirective
  implements OnInit, AfterContentInit, OnDestroy
{
  /** Autocomplete panel */
  @Input('uiAutocomplete')
  autocompletePanel!: AutocompleteComponent;

  /** Autocomplete display key */
  @Input() autocompleteDisplayKey?: any;
  /** Autocomplete scroll strategy */
  @Input() scrollStrategy?: ScrollStrategies = 'close';

  /** Opened event */
  @Output() opened: EventEmitter<void> = new EventEmitter();
  /** Closed event */
  @Output() closed: EventEmitter<void> = new EventEmitter();
  /** Option selected event */
  @Output() optionSelected: EventEmitter<any> = new EventEmitter();

  /** Overlay reference */
  public overlayRef!: OverlayRef;

  /** Input element */
  private inputElement!: HTMLInputElement;
  /** Autocomplete value */
  private value!: any;
  /** Input event listener */
  private inputEventListener!: () => void;
  /** Destroy subject */
  private destroy$ = new Subject<void>();
  /** NgControl */
  private control!: NgControl;
  /** Autocomplete closing actions subscription */
  private autocompleteClosingActionsSubscription!: Subscription;
  /** Select option listener */
  private selectOptionListener!: () => void;
  /** Click outside listener */
  private clickOutsideListener!: () => void;
  /** Timeout to autocomplete close */
  private closeAutoCompleteTimeoutListener!: NodeJS.Timeout;
  /** Timeout to autocomplete animation */
  private AutoCompleteAnimationTimeoutListener!: NodeJS.Timeout;

  /**
   * Get the value from the option to set in the input host element
   * Could be a plain value or an object
   *
   * @param option Option from autocomplete list item
   * @returns The option value needed to set in the host input
   */
  getOptionValue = (option: OptionComponent) =>
    this.autocompleteDisplayKey
      ? option.value[this.autocompleteDisplayKey]
      : option.value;

  /**
   * Get options
   *
   * @returns all the options that are not parent group
   */
  getNotGroupOptionList = () =>
    this.autocompletePanel.options
      ? (this.autocompletePanel.options as QueryList<OptionComponent>).filter(
          (option: OptionComponent) => !option.isGroup
        )
      : [];

  /**
   * Get options
   *
   * @returns all the options that are parent group
   */
  getGroupOptionList = () =>
    this.autocompletePanel.options
      ? (this.autocompletePanel.options as QueryList<OptionComponent>).filter(
          (option: OptionComponent) => option.isGroup
        )
      : [];

  /**
   * UI Autocomplete directive
   *
   * @param control NgControl
   * @param el Element reference where the directive is attached
   * @param renderer Renderer2
   * @param viewContainerRef ViewContainerRef
   * @param overlay Overlay
   * @param document Document
   */
  constructor(
    @Self() @Optional() control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private overlay: Overlay,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.control = control;
    this.inputElement = el.nativeElement as HTMLInputElement;
  }

  /** Check the click event into the input to automatically close the select list */
  @HostListener('click')
  onClick() {
    if (!this.autocompletePanel.openPanel) {
      this.openAutocompletePanel();
    }
  }

  ngOnInit(): void {
    // Add a listener to the input element to unset selected option if input value changes and there is already a selected option
    this.inputEventListener = this.renderer.listen(
      this.inputElement,
      'input',
      (event: Event) => {
        this.updateListAndSelectedOption(
          (event.target as HTMLInputElement).value
        );
      }
    );
    if (this.control?.control) {
      this.value = this.control.control.value;
    } else if (this.inputElement?.value) {
      this.value = this.inputElement.value;
    }
  }

  ngAfterContentInit(): void {
    // Check if form control exists and contains any value
    if (this.control?.control) {
      this.control.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            this.updateListAndSelectedOption(value);
          },
        });
    }
    this.clickOutsideListener = this.renderer.listen(
      this.document,
      'click',
      (event) => {
        if (
          !(
            this.inputElement.contains(event.target) ||
            this.document
              .getElementById('autocompleteList')
              ?.contains(event.target)
          )
        ) {
          this.closeAutocompletePanel();
        }
      }
    );
  }

  /**
   * Updates highlight of items in autocomplete list
   */
  private highLightSelectedOption() {
    this.getNotGroupOptionList().forEach((option: OptionComponent) => {
      // Highlight selected option
      if (isEqual(this.value, option.value)) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
  }

  /**
   * Filter autocomplete list options by given text
   *
   * @param searchText value from autocomplete input
   */
  private filterAutocompleteOptions(searchText: string) {
    // Display/Hide selectable values from autocomplete list
    this.getNotGroupOptionList().forEach((option) => {
      const checkValue =
        option.label && option.label !== ''
          ? option.label
          : this.getOptionValue(option);
      if (checkValue.toLowerCase().includes(searchText.toLowerCase())) {
        option.display = true;
      } else {
        option.display = false;
      }
    });

    // Display /Hide parent values from autocomplete list
    this.getGroupOptionList().forEach((option) => {
      const checkValue =
        option.label && option.label !== ''
          ? option.label
          : this.getOptionValue(option);
      const childOptions = option.options.toArray();
      if (checkValue.toLowerCase().includes(searchText.toLowerCase())) {
        option.display = true;
        childOptions.forEach(
          (option: OptionComponent) => (option.display = true)
        );
      } else {
        if (childOptions.every((option: OptionComponent) => !option.display)) {
          option.display = false;
        } else {
          option.display = true;
        }
      }
    });
  }

  /**
   * Update list filter and selected option on input value change
   *
   * @param value of input
   */
  private updateListAndSelectedOption(value: string) {
    if (
      this.value &&
      !isEqual(
        this.getOptionValue({
          value: this.value,
        } as OptionComponent),
        this.inputElement.value
      )
    ) {
      this.value = null;
      this.highLightSelectedOption();
    }
    if (this.autocompletePanel.openPanel) {
      this.filterAutocompleteOptions(value);
    }
  }

  // AUTOCOMPLETE DISPLAY LOGIC //
  /**
   * Open autocomplete panel and emit opened event
   */
  private openAutocompletePanel() {
    this.autocompletePanel.openPanel = true;
    if (this.inputElement.value !== '' && this.inputElement.value) {
      this.highLightSelectedOption();
    }
    this.filterAutocompleteOptions(this.inputElement.value);
    // We create an overlay for the displayed autocomplete as done for UI menu
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      // close autocomplete on user scroll - default behavior, could be changed
      scrollStrategy:
        this.scrollStrategy === 'close'
          ? this.overlay.scrollStrategies.close()
          : this.overlay.scrollStrategies.block(),
      // We position the displayed autocomplete taking current directive host element as reference
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(
          this.inputElement.parentElement ?? this.inputElement
        )
        .withPositions([
          {
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 0,
            offsetY: 0,
          },
        ]),
      minWidth:
        this.inputElement.parentElement?.clientWidth &&
        this.inputElement.parentElement?.clientWidth !== 0
          ? this.inputElement.parentElement?.clientWidth
          : this.inputElement.clientWidth,
    });
    // Create the template portal for the autocomplete items using the reference of the element with the autocomplete directive
    const templatePortal = new TemplatePortal(
      this.autocompletePanel.templateRef,
      this.viewContainerRef
    );
    // Attach it to our overlay
    this.overlayRef.attach(templatePortal);
    // We add the needed classes to create the animation on autocomplete display
    if (this.AutoCompleteAnimationTimeoutListener) {
      clearTimeout(this.AutoCompleteAnimationTimeoutListener);
    }
    this.AutoCompleteAnimationTimeoutListener = setTimeout(() => {
      this.applyAutocompleteDisplayAnimation(true);
    }, 0);
    // Subscribe to all actions that close the autocomplete (outside click, item click, any other overlay detach)
    this.autocompleteClosingActionsSubscription =
      this.autocompleteClosingActions().subscribe(
        // If so, destroy autocomplete
        () => this.closeAutocompletePanel()
      );

    // Listeners to get the selected option
    if (this.selectOptionListener) {
      this.selectOptionListener();
    }
    this.selectOptionListener = this.renderer.listen(
      this.document.getElementById('autocompleteList'),
      'click',
      (event: any) => {
        const isGroup = JSON.parse(event.target.getAttribute('data-is-group'));
        if (!isGroup) {
          const optionValue = JSON.parse(
            event.target.getAttribute('data-value')
          );
          const isSelected = JSON.parse(
            event.target.getAttribute('data-selected')
          );
          if (isSelected) {
            this.value = optionValue;
          } else {
            this.value = null;
          }
          if (this.control?.control) {
            this.control.control.setValue(this.value, {
              emitEvent: false,
            });
          }
          this.inputElement.value =
            event.target.getAttribute('data-label') || this.value;
          this.optionSelected.emit(this.value);
          this.closeAutocompletePanel();
        }
      }
    );
    this.opened.emit();
  }

  /**
   * Close autocomplete panel and emit closed event
   */
  private closeAutocompletePanel() {
    if (!this.overlayRef || !this.autocompletePanel.openPanel) {
      return;
    }
    // Unsubscribe to our close action subscription
    this.autocompleteClosingActionsSubscription.unsubscribe();
    this.autocompletePanel.openPanel = false;
    this.closed.emit();
    // We remove the needed classes to create the animation on autocomplete close
    this.applyAutocompleteDisplayAnimation(false);
    // Detach the previously created overlay for the autocomplete
    if (this.closeAutoCompleteTimeoutListener) {
      clearTimeout(this.closeAutoCompleteTimeoutListener);
    }
    this.closeAutoCompleteTimeoutListener = setTimeout(() => {
      this.overlayRef.detach();
    }, 100);
  }

  /**
   * Actions linked to the destruction of the current displayed autocomplete
   *
   * @returns Observable of actions
   */
  private autocompleteClosingActions(): Observable<Event | void> {
    const detachment$ = this.overlayRef.detachments();

    return merge(detachment$);
  }

  /**
   * Apply animation to displayed autocomplete
   *
   * @param toDisplay If the autocomplete is going to be displayed or not
   */
  private applyAutocompleteDisplayAnimation(toDisplay: boolean) {
    // The overlayElement is the immediate parent element containing the autocomplete list,
    // therefor we want the immediate child in where we would apply the classes
    const autocompleteList =
      this.overlayRef.overlayElement.querySelector('div');
    if (toDisplay) {
      this.renderer.addClass(autocompleteList, 'translate-y-0');
      this.renderer.addClass(autocompleteList, 'opacity-100');
    } else {
      this.renderer.removeClass(autocompleteList, 'translate-y-0');
      this.renderer.removeClass(autocompleteList, 'opacity-100');
    }
  }

  ngOnDestroy(): void {
    if (this.AutoCompleteAnimationTimeoutListener) {
      clearTimeout(this.AutoCompleteAnimationTimeoutListener);
    }
    if (this.closeAutoCompleteTimeoutListener) {
      clearTimeout(this.closeAutoCompleteTimeoutListener);
    }
    if (this.inputEventListener) {
      this.inputEventListener();
    }
    if (this.selectOptionListener) {
      this.selectOptionListener();
    }
    if (this.clickOutsideListener) {
      this.clickOutsideListener();
    }
    if (this.autocompleteClosingActionsSubscription) {
      this.autocompleteClosingActionsSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
