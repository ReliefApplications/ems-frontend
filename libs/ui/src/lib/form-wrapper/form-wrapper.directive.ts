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
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { Subject, startWith, takeUntil } from 'rxjs';
import { FormControlName, Validators } from '@angular/forms';

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

  // === GET THE ELEMENTS ON WHICH SUFFIX/PREFIX ARE APPLIED ===
  @ContentChildren(SuffixDirective)
  private allSuffixDirectives: QueryList<SuffixDirective> = new QueryList();
  @ContentChildren(PrefixDirective)
  private allPrefixDirectives: QueryList<PrefixDirective> = new QueryList();

  @ContentChild(FormControlName)
  public childControl!: FormControlName;
  @ContentChild(AutocompleteComponent, { read: ElementRef })
  private autocompleteContent!: ElementRef;

  private currentInputElement!: HTMLInputElement;
  private currentLabelElement!: HTMLLabelElement;
  private currentSelectElement!: any;
  private currentTextareaElement!: any;
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
    'bg-transparent',
    'block',
    'overflow-hidden',
    'border-0',
    'rounded-md',
    'w-full',
    'p-0',
    'text-gray-900',
    'placeholder:text-gray-400',
    'sm:text-sm',
    'sm:leading-6',
    'focus:ring-0',
    'focus:ring-inset',
  ] as const;

  private inputClassesOutline = [
    'bg-transparent',
    'block',
    'w-full',
    'border-0',
    'p-0',
    'bg-gray-50',
    'text-gray-900',
    'placeholder:text-gray-400',
    'focus:ring-0',
    'sm:text-sm',
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

  private beyondLabelGeneral = [
    'relative',
    'py-1.5',
    'px-2',
    'flex',
    'items-center',
    'w-full',
  ] as const;

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

  /**
   * Constructor including a ref to the element on which the directive is applied
   * and the renderer.
   *
   * @param renderer renderer
   * @param elementRef references to the element on which the directive is applied
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
    this.renderer.addClass(this.elementRef.nativeElement, 'mb-4');
  }

  ngAfterContentInit() {
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

    if (this.currentInputElement !== null) {
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

    if (this.currentLabelElement) {
      if (this.childControl?.control?.hasValidator(Validators.required)) {
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
    this.initializeDirectiveListeners();

    //Add beyond label as a child of elementRef
    this.renderer.appendChild(
      this.elementRef.nativeElement,
      this.beyondLabelContainer
    );
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
          for (const suffix of suffixes) {
            const suffixRef = (suffix as any).elementRef.nativeElement;
            if (!this.beyondLabelContainer.contains(suffixRef)) {
              this.applySuffixClasses(suffixRef);
              this.renderer.appendChild(this.beyondLabelContainer, suffixRef);
            }
          }
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
    this.renderer.addClass(suffixElement, 'pl-2');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //We need to use afterViewInit for select menu, otherwise removing class does not work
  ngAfterViewInit() {
    this.currentSelectElement =
      this.elementRef.nativeElement.querySelector('ui-select-menu');

    this.currentTextareaElement =
      this.elementRef.nativeElement.querySelector('ui-textarea');

    // Do the same with selectMenu
    if (this.currentSelectElement !== null) {
      //Get select-menu button in order to remove styling elements
      const selectButton = this.currentSelectElement.querySelector('button');
      for (const cl of this.selectButtonRemove) {
        this.renderer.removeClass(selectButton, cl);
      }
      // Class change in order to make the select list display full width and aligned with the form wrapper element
      const listWrapperContainer =
        this.currentSelectElement.querySelector('div');
      this.renderer.removeClass(listWrapperContainer, 'relative');
      const selectList =
        this.currentSelectElement.querySelector('#listWrapper');
      this.renderer.addClass(selectList, 'left-0');
      // Add related classes to select menu element
      if (!this.outline) {
        for (const cl of this.selectClassesNoOutline) {
          this.renderer.addClass(this.currentSelectElement, cl);
        }
      } else {
        for (const cl of this.selectClassesOutline) {
          this.renderer.addClass(this.currentSelectElement, cl);
        }
        this.renderer.removeClass(selectButton, 'bg-white');
        this.renderer.addClass(selectButton, 'bg-gray-50');
      }
      //Add reworked element to beyond label
      this.renderer.appendChild(
        this.beyondLabelContainer,
        this.currentSelectElement
      );
    }

    if (this.autocompleteContent) {
      this.renderer.removeClass(
        this.autocompleteContent.nativeElement.querySelector('div'),
        'relative'
      );
      this.renderer.addClass(this.elementRef.nativeElement, 'relative');
    }

    if (this.currentTextareaElement !== null) {
      const textareaElement =
        this.currentTextareaElement.querySelector('textarea');
      this.renderer.addClass(textareaElement, 'bg-transparent');

      for (const cl of this.textareaRemove) {
        this.renderer.removeClass(textareaElement, cl);
      }
      // Add related classes to input element
      if (!this.outline) {
        for (const cl of this.inputClassesNoOutline) {
          this.renderer.addClass(this.currentTextareaElement, cl);
        }
      } else {
        for (const cl of this.inputClassesOutline) {
          this.renderer.addClass(this.currentTextareaElement, cl);
        }
      }
      this.renderer.addClass(this.elementRef.nativeElement, 'pb-4');
      // Then add the input to our beyondLabel wrapper element
      this.renderer.appendChild(
        this.beyondLabelContainer,
        this.currentTextareaElement
      );
    }
  }
}
