import { Directive, ElementRef } from '@angular/core';

/**
 * UI Suffix Directive
 */
@Directive({
  selector: '[uiPrefix]',
})
export class PrefixDirective {
  /**
   * Constructor of UI Prefix Directive
   *
   * @param elementRef access to the element on which it is applied
   */
  constructor(public elementRef: ElementRef) {}
}
