import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  Optional,
  Self,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormControlComponent } from '@oort-front/ui';
import { Subject } from 'rxjs';

export type Gradient = { color: string; ratio: number }[];

type FormFieldValue = Gradient | null;

/**
 * Gradient picker component.
 */
@Component({
  selector: 'shared-gradient-picker',
  templateUrl: './gradient-picker.component.html',
  styleUrls: ['./gradient-picker.component.scss'],
  providers: [
    {
      provide: FormControlComponent,
      useExisting: forwardRef(() => GradientPickerComponent),
    },
  ],
})
export class GradientPickerComponent
  extends FormControlComponent
  implements ControlValueAccessor, OnDestroy
{
  static nextId = 0;
  public showList = false;

  /**
   * Gets the value
   *
   * @returns the value
   */
  @Input() get value(): FormFieldValue {
    return this.ngControl.value;
  }

  /** Sets the value */
  set value(val: FormFieldValue) {
    this.onChange(val);
    this.stateChanges.next();
  }

  public stateChanges = new Subject<void>();
  @HostBinding()
  id = `shared-gradient-picker-${GradientPickerComponent.nextId++}`;

  /**
   * Gets the placeholder for the select
   *
   * @returns the placeholder
   */
  @Input() get placeholder() {
    return this.ePlaceholder;
  }

  /**
   * Sets the placeholder
   */
  set placeholder(plh) {
    this.ePlaceholder = plh;
    this.stateChanges.next();
  }

  private ePlaceholder = '';
  public focused = false;
  public touched = false;

  /**
   * Gets the empty status
   *
   * @returns if an option is selected
   */
  get empty() {
    // return !this.selected.value;
    return !this.ngControl.control?.value;
  }

  /**
   * Indicates whether the label should be in the floating position
   *
   * @returns whether the label should be in the floating position
   */
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  /**
   * Indicates whether the field is required
   *
   * @returns whether the field is required
   */
  @Input()
  get required() {
    return this.isRequired;
  }

  /**
   * Sets whether the field is required
   */
  set required(req) {
    this.isRequired = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private isRequired = false;

  /**
   * Indicates whether the field is disabled
   *
   * @returns whether the field is disabled
   */
  @Input()
  get disabled(): boolean {
    return this.ngControl.disabled || false;
  }

  /** Sets whether the field is disabled */
  set disabled(value: boolean) {
    const isDisabled = coerceBooleanProperty(value);
    if (isDisabled) this.ngControl.control?.disable();
    else this.ngControl.control?.enable();
    this.stateChanges.next();
  }

  /**
   * Indicates whether the input is in an error state
   *
   * @returns whether the input is in an error state
   */
  get errorState(): boolean {
    return (this.ngControl.invalid && this.touched) || false;
    // return this.ngControl.invalid && this.touched;
    // return this.selected.invalid && this.touched;
  }

  public controlType = 'shared-gradient-picker';

  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy!: string;

  /**
   * Gradient picker component
   *
   * @param elementRef shared element ref service
   * @param ngControl form control shared service
   */
  constructor(
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super();
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onChange = (_: any) => {};

  /**
   * Sets element ids that should be used for the aria-describedby attribute of your control
   *
   * @param ids id array
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.shared-gradient-picker'
    );
    if (!controlElement) return;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  /**
   * Handles mouse click on container
   *
   * @param event Mouse event
   */
  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() !== 'input') {
      this.elementRef.nativeElement.querySelector('input')?.focus();
    }
  }

  /**
   * Gets the value from the parent form control
   *
   * @param val Value set from the linked form control
   */
  writeValue(val: FormFieldValue): void {
    this.value = val;
  }

  /**
   * Register the change function from the parent form to use it
   *
   * @param fn onChange function from the parent form
   */
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  /**
   * Register the touch function from the parent form to use it
   *
   * @param fn onTouched function from the parent form
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Open selection of icon
   */
  onOpenSelect(): void {
    if (!this.disabled) {
      this.showList = true;
    }
  }

  /**
   * Handles focus on input
   */
  onFocusIn() {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  /**
   * Handles lost focus on input
   *
   * @param event The focus event
   */
  onFocusOut(event: FocusEvent) {
    if (
      this.focused &&
      !this.elementRef.nativeElement.contains(event.relatedTarget as Element)
    ) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
  }

  /**
   * Updates the parent form with the given gradient
   *
   * @param gradient Gradient value
   */
  public setGradient(gradient: Gradient) {
    this.showList = false;
    if (gradient) {
      this.value = gradient;
      this.onTouched();
    }
  }
}
