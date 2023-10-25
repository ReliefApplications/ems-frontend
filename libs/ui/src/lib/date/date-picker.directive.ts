import {
  ApplicationRef,
  Directive,
  ElementRef,
  EnvironmentInjector,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  Self,
  createComponent,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { Subject, takeUntil } from 'rxjs';
/**
 * UI Datepicker directive
 */
@Directive({
  selector: '[uiDatePicker]',
})
export class DatePickerDirective implements OnInit, OnDestroy {
  @Input() uiDatePicker: any = 'calendar_today';
  @Input() label = '';

  @Output() clickEvent = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  private clickEventListener!: any;
  private labelElement!: HTMLLabelElement;
  private inputClasses = [
    'peer',
    'block',
    'min-h-[32px]',
    'min-w-[200px]',
    'w-full',
    'rounded',
    'border-0',
    'bg-transparent',
    'px-2',
    'leading-[1.6]',
    'outline-none',
    'text-sm',
  ] as const;

  private labelClasses = [
    'pointer-events-none',
    'absolute',
    'left-2',
    'bg-white',
    'my-[2px]',
    'mr-[5px]',
    'top-0',
    'right-0',
    'bottom-0',
    'truncate',
    'text-neutral-400',
    'min-w-[30px]',
    'flex',
    'items-center',
  ] as const;

  private iconClasses = [
    'flex',
    'items-center',
    'justify-content-center',
    'absolute',
    'outline-none',
    'border-none',
    'bg-transparent',
    'right-0.5',
    'top-1/2',
    '-translate-y-1/2',
  ] as const;

  private divClasses = [
    'relative',
    'focus-within:ring-2',
    'focus-within:ring-inset',
    'focus-within:ring-primary-600',
    'shadow-sm',
    'rounded-md',
    'border-0',
    'ring-1',
    'ring-inset',
    'ring-gray-300',
    'pl-2',
    'flex',
    'items-center',
    'w-full',
    'py-0.5',
    'text-sm',
  ] as const;

  /**
   * UI Date picker directive constructor
   *
   * @param control NgControl instance
   * @param el Directive host element
   * @param renderer Renderer2
   * @param injector EnvironmentInjector
   * @param app ApplicationRef
   * @param translate TranslateService
   */
  constructor(
    @Self() @Optional() private control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2,
    private injector: EnvironmentInjector,
    private app: ApplicationRef,
    private translate: TranslateService
  ) {
    if (!(el.nativeElement instanceof HTMLInputElement)) {
      throw new Error(
        'Directive cannot be applied to an element other than an input'
      );
    }
  }

  ngOnInit(): void {
    this.buildDateInputElement();
    if (this.label) {
      this.setLabelElement();
    }
    this.setIconElement();
    if (this.control?.control) {
      this.control.control.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (value) => {
            // If the control is reset programmatically trigger event to display selected values in calendar,
            // rest of values are set directly from input
            if (!value || value === '') {
              // Trigger input change event to update date picker/ date range element
              const event = new Event('change');
              this.el.nativeElement.dispatchEvent(event);
              if (this.label) {
                this.labelElement.textContent = this.label;
                this.renderer.addClass(this.labelElement, 'left-2');
              }
            } else {
              if (this.label) {
                this.labelElement.textContent = '';
                this.renderer.removeClass(this.labelElement, 'left-2');
              }
            }
          },
        });
      if (this.control.control?.value) {
        this.setValue(this.control.control.value);
        // Trigger input change event to update date picker/ date range element
        const event = new Event('change');
        setTimeout(() => {
          this.el.nativeElement.dispatchEvent(event);
        }, 0);
      }
    }
  }

  /**
   * Build date input element
   */
  private buildDateInputElement() {
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'date');
    this.renderer.setAttribute(this.el.nativeElement, 'format', 'dd/mm/yyyy');
    this.inputClasses.forEach((iClass) => {
      this.renderer.addClass(this.el.nativeElement, iClass);
    });

    const inputWrapper = this.renderer.createElement('div');

    this.divClasses.forEach((iClass) => {
      this.renderer.addClass(inputWrapper, iClass);
    });

    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      inputWrapper
    );

    this.renderer.appendChild(inputWrapper, this.el.nativeElement);
  }

  /**
   * Set given label to the input element
   */
  private setLabelElement() {
    this.labelElement = this.renderer.createElement('label');
    this.labelClasses.forEach((lClass) => {
      this.renderer.addClass(this.labelElement, lClass);
    });
    this.labelElement.innerText = this.label;
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      this.labelElement
    );
  }

  /**
   * Set icon to the input element
   */
  private setIconElement() {
    // Create the icon element
    const icon = createComponent(ButtonComponent, {
      environmentInjector: this.injector,
    });
    icon.instance.icon = this.uiDatePicker;
    icon.instance.size = 'small';
    icon.instance.isIcon = true;
    this.iconClasses.forEach((iClass) => {
      this.renderer.addClass(icon.location.nativeElement, iClass);
    });
    if (this.clickEventListener) {
      this.clickEventListener();
    }
    // Set listener to the icon to display the calendar
    this.clickEventListener = this.renderer.listen(
      icon.location.nativeElement,
      'click',
      () => {
        this.clickEvent.emit();
      }
    );
    // Attach the icon to the DOM
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      icon.location.nativeElement
    );
    this.app.attachView(icon.hostView);
  }

  /**
   * Formats and updates the input value and associated control value if exists
   *
   * @param value Date value to set
   */
  setValue(value: Date) {
    const formattedValue = formatDate(
      value,
      'yyyy-MM-dd',
      this.translate.currentLang ?? this.translate.defaultLang
    );
    if (this.control) {
      this.control.control?.setValue(formattedValue);
    } else {
      this.el.nativeElement.value = formattedValue;
    }
  }

  ngOnDestroy(): void {
    if (this.clickEventListener) {
      this.clickEventListener();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
