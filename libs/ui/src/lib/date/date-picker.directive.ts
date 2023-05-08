import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Renderer2,
  Self,
  ViewContainerRef,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { formatDate } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ButtonComponent } from '../button/button.component';
import { Size } from '../shared/size.enum';
/**
 * UI Datepicker directive
 */
@Directive({
  selector: '[uiDatePicker]',
})
export class DatePickerDirective implements OnInit, OnDestroy {
  @Input() uiDatePicker = 'calendar_today';
  @Input() label = '';

  @Output() clickEvent = new EventEmitter<void>();

  private clickEventListener!: any;
  private inputClasses = [
    'peer',
    'block',
    'min-h-[auto]',
    'min-w-[200px]',
    'w-full',
    'rounded',
    'border-0',
    'bg-transparent',
    'px-2',
    'py-[0.32rem]',
    'leading-[1.6]',
    'outline-none',
    'transition-all',
    'duration-200',
    'ease-linear',
    'focus:placeholder:opacity-100',
    'peer-focus:text-primary',
    'motion-reduce:transition-none',
    'dark:text-neutral-200',
    'dark:placeholder:text-neutral-200',
    'dark:peer-focus:text-primary',
  ] as const;

  private labelClasses = [
    'pointer-events-none',
    'absolute',
    'left-2',
    'bg-white',
    'top-0',
    'mb-0',
    'max-w-[90%]',
    'origin-[0_0]',
    'truncate',
    'pt-[0.3rem]',
    'leading-[1.6]',
    'text-neutral-500',
    'transition-all',
    'duration-200',
    'ease-out',
    '-translate-y-[1rem]',
    'scale-[0.8]',
    'motion-reduce:transition-none',
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

  /**
   * UI Date picker directive constructor
   *
   * @param control NgControl instance
   * @param el Directive host element
   * @param renderer Renderer2
   * @param vcr ViewContainerRef
   * @param translate TranslateService
   */
  constructor(
    @Self() @Optional() private control: NgControl,
    private el: ElementRef,
    private renderer: Renderer2,
    private vcr: ViewContainerRef,
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
    if (this.control.control?.value) {
      this.setValue(this.control.control?.value);
      // Trigger input change event to update date picker/ date range element
      const event = new Event('change');
      setTimeout(() => {
        this.el.nativeElement.dispatchEvent(event);
      }, 0);
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
    this.renderer.addClass(inputWrapper, 'relative');
    this.renderer.addClass(inputWrapper, 'border');
    this.renderer.addClass(inputWrapper, 'rounded');

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
    const labelElement = this.renderer.createElement('label');
    this.labelClasses.forEach((lClass) => {
      this.renderer.addClass(labelElement, lClass);
    });
    labelElement.innerText = this.label;
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      labelElement
    );
  }

  /**
   * Set icon to the input element
   */
  private setIconElement() {
    // Create the icon element
    const icon = this.vcr.createComponent(ButtonComponent);
    icon.instance.icon = this.uiDatePicker;
    icon.instance.size = Size.SMALL;
    icon.instance.isIcon = true;
    this.iconClasses.forEach((iClass) => {
      this.renderer.addClass(icon.location.nativeElement, iClass);
    });
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
      this.translate.currentLang
    );
    if (this.control) {
      this.control.control?.setValue(formattedValue);
    } else {
      this.el.nativeElement.value = formattedValue;
    }
  }

  ngOnDestroy(): void {
    this.clickEventListener();
  }
}
