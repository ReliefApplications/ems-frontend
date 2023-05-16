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
  @ContentChildren(SuffixDirective)
  private allSuffixDirectives: QueryList<SuffixDirective> = new QueryList();
  @ContentChildren(PrefixDirective)
  private allPrefixDirectives: QueryList<PrefixDirective> = new QueryList();

  private currentInputElement!: HTMLInputElement;
  private currentLabelElement!: HTMLLabelElement;

  // === LISTS OF CLASSES TO APPLY TO ELEMENTS ===
  private labelClasses = [
    'block',
    'text-sm',
    'font-medium',
    'leading-6',
    'text-gray-900',
  ] as const;

  private inputClassesNoOutline = [
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
  ] as const;

  private inputClassesOutline = [
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
  ] as const;

  private beyondLabelGeneral = [
    'relative',
    'mt-0.5',
    'py-0.5',
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

  /**
   * Constructor including a ref to the element on which the directive is applied
   * and the renderer.
   *
   * @param renderer renderer
   * @param elementRef references to the element on which the directive is applied
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  ngAfterContentInit() {
    // Get inner input and label elements
    this.currentInputElement =
      this.elementRef.nativeElement.querySelector('input');
    this.currentLabelElement =
      this.elementRef.nativeElement.querySelector('label');

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
    this.renderer.appendChild(beyondLabel, this.currentInputElement);

    // Add related classes to label
    for (const cl of this.labelClasses) {
      this.renderer.addClass(this.currentLabelElement, cl);
    }

    // Get all the child elements that are not input or label and add them to our beyondLabel element
    Array.from(this.elementRef.nativeElement.children)
      .filter(
        (el: any) =>
          !(el instanceof HTMLInputElement || el instanceof HTMLLabelElement)
      )
      .forEach((childEl: any) =>
        this.renderer.appendChild(beyondLabel, childEl)
      );

    //Add beyond label as a child of elementRef
    this.renderer.appendChild(this.elementRef.nativeElement, beyondLabel);
  }
}
