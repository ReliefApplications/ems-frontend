import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { FA_ICONS, IconName } from './icon-picker.const';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { FormControlComponent } from '@oort-front/ui';

type FormFieldValue = IconName | null;

/**
 * Icon picker that loads the icon list with the given font family to display those icons as a grid
 */
@Component({
  selector: 'shared-icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss'],
  providers: [
    {
      provide: FormControlComponent,
      useExisting: forwardRef(() => IconPickerComponent),
    },
  ],
})
export class IconPickerComponent
  extends FormControlComponent
  implements ControlValueAccessor, OnDestroy
{
  /** Static variable to keep track of id increment. */
  static nextId = 0;
  /** Array of icons. */
  public icons: string[] = FA_ICONS;
  /** Primary color for the icon. */
  private primaryColor!: string;
  /** Input decorator for color */
  @Input() color: string = this.primaryColor;
  /** Boolean to control the visibility of the list. */
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
  /** Input decorator for fontFamily */
  @Input() fontFamily = 'fa';
  /** Subject to emit state changes. */
  public stateChanges = new Subject<void>();
  /** HostBinding decorator for id. */
  @HostBinding()
  id = `shared-icon-picker-${IconPickerComponent.nextId++}`;

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
  /** Private variable for placeholder. */
  private ePlaceholder = '';
  /** Boolean to track focus state. */
  public focused = false;
  /** Boolean to track touch state. */
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
  /** Private variable to track if the field is required. */
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
  /** The type of control. */
  public controlType = 'shared-icon-picker';
  /** Input decorator for aria-describedby. */
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('aria-describedby') userAriaDescribedBy!: string;

  /**
   * On click display the grid icon list
   */
  @HostListener('click')
  onClick() {
    this.showList = true;
  }

  /**
   * On escape close the grid icon list
   */
  @HostListener('document:keydown.escape')
  onEsc() {
    this.showList = false;
  }

  /**
   * Icon picker component
   *
   * @param environment platform environment
   * @param elementRef shared element ref service
   * @param ngControl form control shared service
   */
  constructor(
    @Inject('environment') environment: any,
    private elementRef: ElementRef<HTMLElement>,
    @Optional() @Self() public ngControl: NgControl
  ) {
    super();
    this.primaryColor = environment.theme.primary;
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }
  /** Function to handle touch events. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  /**
   * Function to handle change events.
   *
   * @param _ value
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onChange = (_: any) => {};

  /**
   * Sets element ids that should be used for the aria-describedby attribute of your control
   *
   * @param ids id array
   */
  setDescribedByIds(ids: string[]) {
    const controlElement = this.elementRef.nativeElement.querySelector(
      '.shared-icon-picker'
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
   * Updates the parent form with the given icon
   *
   * @param icon Icon value
   */
  public setIcon(icon?: string) {
    this.showList = false;
    if (icon) {
      this.value = icon;
      this.onTouched();
    }
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
  /** Function to handle component destruction. */
  ngOnDestroy(): void {
    this.stateChanges.complete();
  }
}
