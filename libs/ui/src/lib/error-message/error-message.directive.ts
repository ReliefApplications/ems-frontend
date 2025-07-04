import {
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  Input,
  Optional,
  Renderer2,
} from '@angular/core';
import { FormWrapperDirective } from '../form-wrapper/form-wrapper.directive';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * UI Error Message directive
 */
@Directive({
  selector: '[uiErrorMessage]',
})
export class ErrorMessageDirective {
  /**
   * Set current error messages and updates the error message template if exists
   */
  @Input() set uiErrorMessage(message: any) {
    if (message) {
      this.currentErrorMessage = message;
      if (this.errorMessageTemplate) {
        this.errorMessageTemplate.textContent = this.currentErrorMessage;
      }
    }
  }

  /**
   * Display or remove error message template by the given condition
   */
  @Input() set uiErrorMessageIf(show: any) {
    if (this.hostIsReady) {
      if (show) {
        this.displayErrorMessage();
      } else {
        this.removeErrorMessage();
      }
    }
  }

  /** Current error message */
  private currentErrorMessage = '';
  /** Error message template */
  private errorMessageTemplate!: HTMLSpanElement;
  /** Error message classes */
  private errorMessageClasses = [
    'block',
    'text-red-400',
    'py-2',
    'text-xs',
  ] as const;
  /** Host is ready */
  private hostIsReady = false;
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * UI Error Message constructor
   *
   * @param formWrapperDirective FormWrapperDirective
   * @param el Directive host element
   * @param renderer Renderer2
   */
  constructor(
    @Optional() private formWrapperDirective: FormWrapperDirective,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    this.buildErrorMessageTemplate();
    if (this.formWrapperDirective) {
      this.formWrapperDirective.elementWrapped
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (hostIsReady: boolean) => (this.hostIsReady = hostIsReady),
        });
    } else {
      this.hostIsReady = true;
    }
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
    this.errorMessageTemplate.textContent = this.currentErrorMessage;
    this.renderer.appendChild(this.el.nativeElement, this.errorMessageTemplate);
  }

  /**
   * Remove error message from DOM
   */
  private removeErrorMessage() {
    this.renderer.removeChild(this.el.nativeElement, this.errorMessageTemplate);
  }
}
