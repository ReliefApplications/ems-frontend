import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

/**
 * UI Error Message directive
 */
@Directive({
  selector: '[uiErrorMessage]',
})
export class ErrorMessageDirective {
  @Input() uiErrorMessage = '';
  /**
   * Display or remove error message template by the given condition
   */
  @Input() set uiErrorMessageIf(show: any) {
    if (show) {
      this.displayErrorMessage();
    } else {
      this.removeErrorMessage();
    }
  }
  errorMessageTemplate!: HTMLSpanElement;
  private errorMessageClasses = ['block', 'text-red-400'] as const;

  /**
   * UI Error Message constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.buildErrorMessageTemplate();
  }

  /**
   * Build the error message template
   */
  private buildErrorMessageTemplate() {
    this.errorMessageTemplate = this.renderer.createElement('span');
    this.errorMessageClasses.forEach((elClass) => {
      this.renderer.addClass(this.errorMessageTemplate, elClass);
    });
  }

  /**
   * Add error message to DOM
   */
  private displayErrorMessage() {
    this.errorMessageTemplate.textContent = this.uiErrorMessage;
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      this.errorMessageTemplate
    );
  }

  /**
   * Remove error message from DOM
   */
  private removeErrorMessage() {
    this.renderer.removeChild(
      this.el.nativeElement.parentElement,
      this.errorMessageTemplate
    );
  }
}
