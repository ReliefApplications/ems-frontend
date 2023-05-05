import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { DateValues } from './enums/date-values.enum';
import { IconComponent } from '../icon/icon.component';

/**
 * UI Datepicker directive
 */
@Directive({
  selector: '[uiDatePicker]',
})
export class DatePickerDirective implements OnInit, OnDestroy {
  @Input() uiDatePicker = 'calendar';
  @Input() dateValueSet?: DateValues;
  @Input() label = '';

  @Output() clickEvent = new EventEmitter<void>();
  private clickEventListener!: any;
  private inputClasses = [
    'peer',
    'block',
    'min-h-[auto]',
    'w-full',
    'rounded',
    'border-0',
    'bg-transparent',
    'px-3',
    'py-[0.32rem]',
    'leading-[1.6]',
    'outline-none',
    'transition-all',
    'duration-200',
    'ease-linear',
    'focus:placeholder:opacity-100',
    'peer-focus:text-primary',
    'data-[te-input-state-active]:placeholder:opacity-100',
    'motion-reduce:transition-none',
    'dark:text-neutral-200',
    'dark:placeholder:text-neutral-200',
    'dark:peer-focus:text-primary',
    '[&:not([data-te-input-placeholder-active])]:placeholder:opacity-0',
  ] as const;

  private labelClasses = [
    'pointer-events-none',
    'absolute',
    'left-3',
    'top-0',
    'mb-0',
    'max-w-[90%]',
    'origin-[0_0]',
    'truncate',
    'pt-[0.37rem]',
    'leading-[1.6]',
    'text-neutral-500',
    'transition-all',
    'duration-200',
    'ease-out',
    'peer-focus:-translate-y-[0.9rem]',
    'peer-focus:scale-[0.8]',
    'peer-focus:text-primary',
    'peer-data-[te-input-state-active]:-translate-y-[0.9rem]',
    'peer-data-[te-input-state-active]:scale-[0.8]',
    'motion-reduce:transition-none',
    'dark:text-neutral-200',
    'dark:peer-focus:text-primary',
  ] as const;

  private iconClasses = [
    'flex',
    'cursor-pointer',
    'items-center',
    'justify-content-center',
    'absolute',
    'outline-none',
    'border-none',
    'bg-transparent',
    'right-0.5',
    'top-1/2',
    '-translate-x-1/2',
    '-translate-y-1/2',
    'hover:text-primary',
    'focus:text-primary',
    'dark:hover:text-primary-400',
    'dark:focus:text-primary-400',
    'dark:text-neutral-200',
  ] as const;

  /**
   * UI Date picker directive constructor
   *
   * @param el Directive host element
   * @param renderer Renderer2
   * @param vcr ViewContainerRef
   */
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private vcr: ViewContainerRef
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
  }

  /**
   * Build date input element
   */
  private buildDateInputElement() {
    this.renderer.setAttribute(this.el.nativeElement, 'type', 'date');
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
    const icon = this.vcr.createComponent(IconComponent);
    icon.instance.icon = this.uiDatePicker;
    icon.instance.size = 18;
    this.clickEventListener = this.renderer.listen(
      icon.location.nativeElement,
      'click',
      () => {
        this.clickEvent.emit();
      }
    );
    this.iconClasses.forEach((iClass) => {
      this.renderer.addClass(icon.location.nativeElement, iClass);
    });
    this.renderer.appendChild(
      this.el.nativeElement.parentElement,
      icon.location.nativeElement
    );
  }

  ngOnDestroy(): void {
    this.clickEventListener();
  }
}
