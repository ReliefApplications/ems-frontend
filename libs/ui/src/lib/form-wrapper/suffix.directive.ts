import { Directive, ElementRef } from '@angular/core';

/**
 * UI Suffix Directive
 */
@Directive({
  selector: '[uiSuffix]',
})
export class SuffixDirective {
  /**
   * Constructor of UI Suffix Directive
   *
   * @param elementRef access to the element on which it is applied
   */
  constructor(public elementRef: ElementRef) {}
}
