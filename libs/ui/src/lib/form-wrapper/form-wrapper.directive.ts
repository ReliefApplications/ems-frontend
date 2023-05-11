import {
  AfterContentInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';
import { SuffixDirective } from './suffix.directive';
import { PrefixDirective } from './prefix.directive';

/**
 * UI Form Wrapper Directive
 */
@Directive({
  selector: '[uiFormFieldDirective]',
})
export class FormWrapperDirective implements AfterContentInit {
  /**
   * Will the form field be wrapped ?
   */
  @Input() outline = false;

  // === GET THE ELEMENTS ON WHICH SUFFIX/PREFIX ARE APPLIED ===
  @ContentChildren(SuffixDirective, { descendants: true })
  allSuffixDirectives: QueryList<SuffixDirective> = new QueryList();
  @ContentChildren(PrefixDirective)
  allPrefixDirectives: QueryList<PrefixDirective> = new QueryList();

  // === LISTS OF CLASSES TO APPLY TO ELEMENTS ===
  labelClasses = [
    'block',
    'text-sm',
    'font-medium',
    'leading-6',
    'text-gray-900',
  ];

  inputClassesNoOutline = [
    'block',
    'overflow-hidden',
    'border-0',
    'rounded-md',
    'w-full',
    'py-1.5',
    'pr-10',
    'text-gray-900',
    'placeholder:text-gray-400',
    'sm:text-sm',
    'sm:leading-6',
    'focus:ring-0',
    'focus:ring-inset',
  ];

  inputClassesOutline = [
    'block',
    'w-full',
    'border-0',
    'py-1.5',
    'bg-gray-50',
    'text-gray-900',
    'placeholder:text-gray-400',
    'focus:ring-0',
    'sm:text-sm',
    'sm:leading-6',
  ];

  beyondLabelGeneral = [
    'relative',
    'mt-0.5',
    'py-0.5',
    'flex',
    'items-center',
    'w-full',
  ];

  beyondLabelNoOutline = [
    'focus-within:ring-2',
    'focus-within:ring-inset',
    'focus-within:ring-primary-600',
    'shadow-sm',
    'rounded-md',
    'border-0',
    'ring-1',
    'ring-inset',
    'ring-gray-300',
  ];

  beyondLabelOutline = [
    'bg-gray-50',
    'border-0',
    'border-b',
    'border-b-gray-300',
    'focus-within:border-b-2',
    'focus-within:border-b-primary-600',
  ];

  /**
   * Constructor including a ref to the element on which the directive is applied
   * and the renderer.
   *
   * @param renderer renderer
   * @param elementRef references to the element on which the directive is applied
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    //Putting order classes to elements that has prefix/suffix directive
    for (const e of this.allPrefixDirectives) {
      this.renderer.addClass(e.elementRef.nativeElement, 'order-first');
      this.renderer.addClass(e.elementRef.nativeElement, 'px-2');
    }
    for (const e of this.allSuffixDirectives) {
      this.renderer.addClass(e.elementRef.nativeElement, 'order-last');
      this.renderer.addClass(e.elementRef.nativeElement, 'px-2');
    }

    // Creating a wrapper to all that is not label and give it appropriate classes
    // depending of outline value
    const beyondLabel = this.renderer.createElement('div');
    for (const cl of this.beyondLabelGeneral) {
      this.renderer.addClass(beyondLabel, cl);
    }
    if (!this.outline) {
      for (const cl of this.beyondLabelNoOutline) {
        this.renderer.addClass(beyondLabel, cl);
      }
    } else {
      for (const cl of this.beyondLabelOutline) {
        this.renderer.addClass(beyondLabel, cl);
      }
    }

    // Create a deep copy of the list of children elements (because otherwise, it will mess the following loop)
    const elementsCopy = Array.prototype.slice
      .call(this.elementRef.nativeElement.children)
      .map((x: any) => x);

    // Loop to apply classes to elements depending on their tag/outline value
    // + add elements that are not label to the wrapper created before
    for (const child of elementsCopy) {
      // Getting classes to input
      if (child.tagName === 'INPUT' && !this.outline) {
        for (const cl of this.inputClassesNoOutline) {
          this.renderer.addClass(child, cl);
        }
      } else if (child.tagName === 'INPUT' && this.outline) {
        for (const cl of this.inputClassesOutline) {
          this.renderer.addClass(child, cl);
        }
      }
      // Getting classes to label
      if (child.tagName === 'LABEL') {
        for (const cl of this.labelClasses) {
          this.renderer.addClass(child, cl);
        }
      }
      // Putting other things as child of beyond label
      if (!(child.tagName === 'LABEL')) {
        this.renderer.appendChild(beyondLabel, child);
      }
    }

    //Add beyond label as a child of elementRef
    this.renderer.appendChild(this.elementRef.nativeElement, beyondLabel);
  }
}
