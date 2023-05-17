import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  Input,
  QueryList,
  Renderer2,
} from '@angular/core';
import { SuffixDirective } from './suffix.directive';
import { PrefixDirective } from './prefix.directive';
import { SelectMenuComponent } from '../select-menu/select-menu.component';

/**
 * UI Form Wrapper Directive
 */
@Directive({
  selector: '[uiFormFieldDirective]',
})
export class FormWrapperDirective implements AfterContentInit, AfterViewInit {
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
  private currentSelectElement!: HTMLLabelElement;
  private beyondLabel!: any;

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

  private selectClassesNoOutline = [
    'block',
    'w-full',
    'py-1.5',
    'pr-1',
  ] as const;

  private selectClassesOutline = [
    'block',
    'w-full',
    'border-0',
    'py-1.5',
    'pr-1',
    'bg-gray-50',
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

  private selectButtonRemove = [
    'ring-1',
    'ring-inset',
    'ring-gray-300',
    'focus:ring-2',
    'focus:ring-primary-600',
    'shadow-sm',
  ] as const;

  /**
   * Constructor including a ref to the element on which the directive is applied
   * and the renderer.
   *
   * @param renderer renderer
   * @param elementRef references to the element on which the directive is applied
   */
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

  //After content init add classes where needed and do all it can
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
    this.beyondLabel = this.renderer.createElement('div');
    for (const cl of this.beyondLabelGeneral) {
      this.renderer.addClass(this.beyondLabel, cl);
    }
    if (!this.outline) {
      for (const cl of this.beyondLabelNoOutline) {
        this.renderer.addClass(this.beyondLabel, cl);
      }
    } else {
      for (const cl of this.beyondLabelOutline) {
        this.renderer.addClass(this.beyondLabel, cl);
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
      this.renderer.appendChild(this.beyondLabel, this.currentInputElement);
    }

    // Add related classes to label
    for (const cl of this.labelClasses) {
      this.renderer.addClass(this.currentLabelElement, cl);
    }

    // Get all the child elements that are not input or label or SelectMenu and add them to our beyondLabel element
    Array.from(this.elementRef.nativeElement.children)
      .filter(
        (el: any) =>
          !(
            el instanceof HTMLInputElement ||
            el instanceof HTMLLabelElement ||
            el instanceof SelectMenuComponent
          )
      )
      .forEach((childEl: any) =>
        this.renderer.appendChild(this.beyondLabel, childEl)
      );

    //Add beyond label as a child of elementRef
    this.renderer.appendChild(this.elementRef.nativeElement, this.beyondLabel);
  }

  //We need to use afterViewInit for select menu, otherwise removing class does not work
  ngAfterViewInit() {
    this.currentSelectElement =
      this.elementRef.nativeElement.querySelector('ui-select-menu');

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
      this.renderer.appendChild(this.beyondLabel, this.currentSelectElement);
    }
  }
}
