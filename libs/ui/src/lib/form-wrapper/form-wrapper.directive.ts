import {
  AfterContentInit,
  AfterViewInit,
  ContentChild,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  Renderer2,
} from '@angular/core';
import { SuffixDirective } from './suffix.directive';
import { PrefixDirective } from './prefix.directive';
import { BehaviorSubject, Subject, startWith, takeUntil } from 'rxjs';
import { SelectMenuComponent } from '../select-menu/select-menu.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { GraphQLSelectComponent } from '../graphql-select/graphql-select.component';
import { FormControlName, Validators, FormControlStatus } from '@angular/forms';
import { ChipListDirective } from '../chip/chip-list.directive';
import { DateWrapperDirective } from '../date/date-wrapper.directive';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { FormControlComponent } from './form-control/form-control.component';

/**
 * UI Form Wrapper Directive
 */
@Directive({
  selector: '[uiFormFieldDirective]',
})
export class FormWrapperDirective
  implements AfterContentInit, AfterViewInit, OnDestroy
{
  /**
   * Will the form field be wrapped ?
   */
  @Input() outline = false;
  /**
   * Set default margin for separation in the current form field
   */
  @Input() defaultMargin = true;
  // === GET THE ELEMENTS ON WHICH SUFFIX/PREFIX ARE APPLIED ===
  @ContentChildren(SuffixDirective)
  private allSuffixDirectives: QueryList<SuffixDirective> = new QueryList();
  @ContentChildren(PrefixDirective)
  private allPrefixDirectives: QueryList<PrefixDirective> = new QueryList();

  @ContentChild(AutocompleteComponent)
  private autocompleteContent!: AutocompleteComponent;
  @ContentChild(SelectMenuComponent, { read: ElementRef })
  private currentSelectElement!: ElementRef;
  @ContentChild(TextareaComponent, { read: ElementRef })
  private currentTextareaElement!: ElementRef;
  @ContentChild(GraphQLSelectComponent)
  private currentGraphQLSelectComponent!: GraphQLSelectComponent;
  @ContentChild(ChipListDirective, { read: ElementRef })
  private chipListElement!: ElementRef;
  @ContentChild(DateWrapperDirective, { read: ElementRef })
  private dateWrapperElement!: ElementRef;
  @ContentChild(FormControlComponent, { read: ElementRef })
  private formControlElement!: ElementRef;

  @ContentChild(FormControlName) control!: FormControlName;

  private currentInputElement!: HTMLInputElement;
  private currentLabelElement!: HTMLLabelElement;
  private beyondLabelContainer!: HTMLDivElement;

  // === LISTS OF CLASSES TO APPLY TO ELEMENTS ===
  private labelClasses = [
    'block',
    'text-sm',
    'font-medium',
    'leading-6',
    'text-gray-900',
  ] as const;

  private inputClassesNoOutline = [
    'form-input',
    'bg-transparent',
    'block',
    'overflow-hidden',
    'border-0',
    'rounded-md',
    'w-full',
    'p-0',
    'text-gray-900',
    'placeholder:text-gray-400',
    'text-sm',
    'sm:leading-6',
    'focus:ring-0',
    'focus:ring-inset',
  ] as const;

  private inputClassesOutline = [
    'form-input',
    'bg-transparent',
    'block',
    'w-full',
    'border-0',
    'p-0',
    'bg-gray-50',
    'text-gray-900',
    'placeholder:text-gray-400',
    'focus:ring-0',
    'text-sm',
    'sm:leading-6',
  ] as const;

  private selectClassesNoOutline = ['block', 'w-full', 'pr-1'] as const;

  private selectClassesOutline = [
    'block',
    'w-full',
    'border-0',
    'pr-1',
    'bg-gray-50',
  ] as const;

  private beyondLabelGeneral = ['relative', 'flex', 'py-1.5', 'px-2'] as const;
  private beyondLabelNoChipList = ['flex', 'items-center', 'w-full'] as const;
  private beyondLabelNoOutline = [
    'focus-within:ring-2',
    'focus-within:ring-inset',
    'focus-within:ring-primary-600',
    'shadow-sm',
    'rounded-md',
    'border-0',
    'ring-1',
    'ring-inset',
    'ring-gray-300',
  ] as const;

  private beyondLabelOutline = [
    'bg-gray-50',
    'border-0',
    'border-b',
    'border-b-gray-300',
    'focus-within:border-b-2',
    'focus-within:border-b-primary-600',
  ] as const;

  private selectButtonRemove = [
    'px-3',
    'ring-1',
    'ring-inset',
    'ring-gray-300',
    'focus:ring-2',
    'focus:ring-primary-600',
    'shadow-sm',
  ] as const;

  private textareaRemove = [
    'rounded-md',
    'shadow-sm',
    'ring-1',
    'ring-inset',
    'ring-gray-300',
    'focus:ring-2',
    'focus:ring-inset',
    'focus:ring-primary-600',
  ];

  private destroy$ = new Subject<void>();
  elementWrapped = new BehaviorSubject<boolean>(false);

  /**
   * Constructor including a ref to the element on which the directive is applied
   * and the renderer.
   *
   * @param renderer renderer
   * @param elementRef references to the element on which the directive is applied
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  //We need to use afterViewInit for select menu, otherwise removing class does not work
  ngAfterViewInit() {
    if (this.defaultMargin) {
      this.renderer.addClass(this.elementRef.nativeElement, 'mb-4');
    }
    // Do the same with selectMenu
    if (this.currentSelectElement || this.currentGraphQLSelectComponent) {
      if (this.currentGraphQLSelectComponent) {
        this.currentGraphQLSelectComponent.elementSelect.isGraphQlSelect = true;
      }
      this.renderer.removeClass(this.beyondLabelContainer, 'py-1.5');
      this.renderer.addClass(this.beyondLabelContainer, 'py-0.5');
      const currentElement = this.currentGraphQLSelectComponent
        ? this.currentGraphQLSelectComponent.elementRef
        : this.currentSelectElement;
      //Get select-menu button in order to remove styling elements
      const selectButton = currentElement.nativeElement.querySelector('button');
      for (const cl of this.selectButtonRemove) {
        this.renderer.removeClass(selectButton, cl);
      }
      // Add related classes to select menu element
      if (!this.outline) {
        for (const cl of this.selectClassesNoOutline) {
          this.renderer.addClass(currentElement.nativeElement, cl);
        }
      } else {
        for (const cl of this.selectClassesOutline) {
          this.renderer.addClass(currentElement.nativeElement, cl);
        }
        this.renderer.removeClass(selectButton, 'bg-white');
        this.renderer.addClass(selectButton, 'bg-gray-50');
      }
      // this.renderer.addClass(this.elementRef.nativeElement, 'pb-4');
      // Add reworked element to beyond label
      this.renderer.appendChild(
        this.beyondLabelContainer,
        currentElement.nativeElement
      );
    }

    if (this.autocompleteContent) {
      // this.renderer.removeClass(
      //   this.autocompleteContent.nativeElement.querySelector('div'),
      //   'relative'
      // );
      this.renderer.addClass(this.elementRef.nativeElement, 'relative');
    }

    if (this.currentTextareaElement) {
      const textareaElement =
        this.currentTextareaElement.nativeElement.querySelector('textarea');
      this.renderer.addClass(textareaElement, 'bg-transparent');

      for (const cl of this.textareaRemove) {
        this.renderer.removeClass(textareaElement, cl);
      }
      // Add related classes to input element
      if (!this.outline) {
        for (const cl of this.inputClassesNoOutline) {
          this.renderer.addClass(this.currentTextareaElement.nativeElement, cl);
        }
      } else {
        for (const cl of this.inputClassesOutline) {
          this.renderer.addClass(this.currentTextareaElement.nativeElement, cl);
        }
      }
      this.renderer.addClass(this.elementRef.nativeElement, 'pb-3');
      // Then add the input to our beyondLabel wrapper element
      this.renderer.appendChild(
        this.beyondLabelContainer,
        this.currentTextareaElement.nativeElement
      );
    }
  }

  ngAfterContentInit() {
    // Manage form control status changes
    if (this.control) {
      this.control.control.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (status: FormControlStatus) => {
            // Disabled state
            if (status === 'DISABLED') {
              this.setDisableState();
            } else {
              this.removeDisableState();
            }
            // Error state
            if (this.control.control.validator) {
              if (status === 'INVALID') {
                this.setInvalidState();
              } else {
                this.removeInvalidState();
              }
            }
          },
        });
    }
    // Get inner input and label elements
    this.currentInputElement =
      this.elementRef.nativeElement.querySelector('input');
    this.currentLabelElement =
      this.elementRef.nativeElement.querySelector('label');

    // Creating a wrapper to all that is not label and give it appropriate classes
    // depending of outline value
    this.beyondLabelContainer = this.renderer.createElement('div');
    for (const cl of this.beyondLabelGeneral) {
      this.renderer.addClass(this.beyondLabelContainer, cl);
    }

    if (!this.outline) {
      for (const cl of this.beyondLabelNoOutline) {
        this.renderer.addClass(this.beyondLabelContainer, cl);
      }
    } else {
      for (const cl of this.beyondLabelOutline) {
        this.renderer.addClass(this.beyondLabelContainer, cl);
      }
    }

    // Remove right padding for select
    if (this.currentSelectElement || this.currentGraphQLSelectComponent) {
      this.renderer.removeClass(this.beyondLabelContainer, 'px-2');
      this.renderer.addClass(this.beyondLabelContainer, 'pl-2');
      this.renderer.addClass(this.beyondLabelContainer, 'bg-white');
    }

    if (this.currentInputElement && !this.dateWrapperElement) {
      // Add related classes to input element
      if (!this.outline) {
        for (const cl of this.inputClassesNoOutline) {
          this.renderer.addClass(this.currentInputElement, cl);
        }
      } else {
        for (const cl of this.inputClassesOutline) {
          this.renderer.addClass(this.currentInputElement, cl);
        }
      }
      // Then add the input to our beyondLabel wrapper element
      this.renderer.appendChild(
        this.beyondLabelContainer,
        this.currentInputElement
      );
    }

    if (this.chipListElement) {
      this.renderer.insertBefore(
        this.beyondLabelContainer,
        this.chipListElement.nativeElement,
        this.currentInputElement
      );
      this.renderer.removeClass(this.beyondLabelContainer, 'flex');
    } else {
      if (this.formControlElement) {
        this.renderer.insertBefore(
          this.beyondLabelContainer,
          this.formControlElement.nativeElement,
          this.currentInputElement
        );
        // this.renderer.removeClass(this.beyondLabelContainer, 'flex');
      } else {
        for (const cl of this.beyondLabelNoChipList) {
          this.renderer.addClass(this.beyondLabelContainer, cl);
        }
      }
    }

    if (this.currentLabelElement) {
      if (this.control?.control?.hasValidator(Validators.required)) {
        this.renderer.appendChild(
          this.currentLabelElement,
          this.renderer.createText(' *')
        );
      }
      // Add related classes to label
      for (const cl of this.labelClasses) {
        this.renderer.addClass(this.currentLabelElement, cl);
      }
    }

    // Check if form control inits with disabled state
    if (this.control?.control?.disabled) {
      this.setDisableState();
    }

    this.initializeDirectiveListeners();

    //Add beyond label as a child of elementRef
    if (!this.dateWrapperElement) {
      this.renderer.appendChild(
        this.elementRef.nativeElement,
        this.beyondLabelContainer
      );
    }

    this.elementWrapped.next(true);
  }

  /**
   * Initialize any DOM change/add/removal of the elements with prefix and suffix directives
   */
  private initializeDirectiveListeners() {
    this.allPrefixDirectives.changes
      .pipe(startWith(this.allPrefixDirectives), takeUntil(this.destroy$))
      .subscribe({
        next: (prefixes: QueryList<PrefixDirective>) => {
          for (const prefix of prefixes) {
            const prefixRef = (prefix as any).elementRef.nativeElement;
            if (!this.beyondLabelContainer.contains(prefixRef)) {
              this.applyPrefixClasses(prefixRef);
              this.renderer.appendChild(this.beyondLabelContainer, prefixRef);
            }
          }
        },
      });
    this.allSuffixDirectives.changes
      .pipe(startWith(this.allSuffixDirectives), takeUntil(this.destroy$))
      .subscribe({
        next: (suffixes: QueryList<SuffixDirective>) => {
          suffixes.forEach((suffix) => {
            const suffixRef = (suffix as any).elementRef.nativeElement;
            if (!this.beyondLabelContainer.contains(suffixRef)) {
              this.applySuffixClasses(suffixRef);
              // Support to insert elements in order if more than one suffix element is set
              if (suffix === suffixes.first) {
                try {
                  this.renderer.insertBefore(
                    this.beyondLabelContainer,
                    suffixRef,
                    suffixes.last.elementRef.nativeElement
                  );
                } catch (error) {
                  this.renderer.appendChild(
                    this.beyondLabelContainer,
                    suffixRef
                  );
                }
              } else {
                this.renderer.appendChild(this.beyondLabelContainer, suffixRef);
              }
            }
          });
        },
      });
  }

  /**
   * Update prefix element with the needed classes
   *
   * @param prefixElement prefix directive element
   */
  private applyPrefixClasses(prefixElement: any) {
    this.renderer.addClass(prefixElement, 'order-first');
    this.renderer.addClass(prefixElement, 'pr-2');
  }

  /**
   * Update suffix element with the needed classes
   *
   * @param suffixElement suffix directive element
   */
  private applySuffixClasses(suffixElement: any) {
    this.renderer.addClass(suffixElement, 'order-last');
    this.renderer.addClass(suffixElement, 'px-2');
  }

  /**
   * Set invalid state styling to form wrapper directive element
   */
  private setInvalidState() {
    this.renderer.addClass(this.beyondLabelContainer, 'ring-red-400');
    if (this.currentLabelElement) {
      this.renderer.addClass(this.currentLabelElement, 'text-red-400');
    }
  }

  /**
   * Remove invalid state styling from form wrapper directive element
   */
  private removeInvalidState() {
    this.renderer.removeClass(this.beyondLabelContainer, 'ring-red-400');
    if (this.currentLabelElement) {
      this.renderer.removeClass(this.currentLabelElement, 'text-red-400');
    }
  }

  /**
   * Set disable state styling to form wrapper directive element
   */
  private setDisableState() {
    this.renderer.addClass(this.beyondLabelContainer, 'opacity-50');
    if (!this.outline) {
      this.renderer.removeClass(
        this.beyondLabelContainer,
        'focus-within:ring-2'
      );
      this.renderer.removeClass(
        this.beyondLabelContainer,
        'focus-within:ring-inset'
      );
      this.renderer.removeClass(
        this.beyondLabelContainer,
        'focus-within:ring-primary-600'
      );
    }
    if (this.chipListElement && this.currentInputElement) {
      this.currentInputElement.disabled = true;
    }
  }

  /**
   * Remove disable state styling from form wrapper directive element
   */
  private removeDisableState() {
    this.renderer.removeClass(this.beyondLabelContainer, 'opacity-50');
    if (!this.outline) {
      this.renderer.addClass(this.beyondLabelContainer, 'focus-within:ring-2');
      this.renderer.addClass(
        this.beyondLabelContainer,
        'focus-within:ring-inset'
      );
      this.renderer.addClass(
        this.beyondLabelContainer,
        'focus-within:ring-primary-600'
      );
    }
    if (this.chipListElement && this.currentInputElement) {
      this.currentInputElement.disabled = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
