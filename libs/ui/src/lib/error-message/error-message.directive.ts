import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  Optional,
  Renderer2,
} from '@angular/core';
import { FormWrapperDirective } from '../form-wrapper/form-wrapper.directive';
import { Subject, takeUntil } from 'rxjs';

/**
 * UI Error Message directive
 */
@Directive({
  selector: '[uiErrorMessage]',
})
export class ErrorMessageDirective implements OnDestroy {
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

  private currentErrorMessage = '';
  private errorMessageTemplate!: HTMLSpanElement;
  private errorMessageClasses = [
    'block',
    'text-red-400',
    'py-2',
    'text-xs',
  ] as const;
  private destroy$ = new Subject<void>();
  private hostIsReady = false;

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
        .pipe(takeUntil(this.destroy$))
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
