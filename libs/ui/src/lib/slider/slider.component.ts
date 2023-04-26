import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * UI Slider component
 */
@Component({
  selector: 'ui-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true,
    },
  ],
})
export class SliderComponent implements ControlValueAccessor {
  /**
   * Minimum value of the slider
   */
  @Input() minValue = 0;
  /**
   * Maximum value of the slider
   */
  @Input() maxValue = 100;

  //In order to define left position of the bubble linked to the slider
  bubbleStyle = '';
  //In order to determine if bubble and ticks are to be shown
  bubbleToShow = false;
  ticksToShow = false;

  //Value of the slider
  val = this.minValue;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange: any = () => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch: any = () => {};

  /**
   * Set value of control access value
   */
  set value(val: number) {
    if (val !== undefined && this.val !== val) {
      this.val = val;
      this.onChange(val);
      this.onTouch(val);
    }
  }

  /**
   * Actually change the value of value
   *
   * @param value
   * value to replace
   */
  writeValue(value: any): void {
    this.value = value;
  }

  /**
   * Record on change
   *
   * @param fn
   * event that took place
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * Record on touch
   *
   * @param fn
   * event that took place
   */
  registerOnTouched(fn: any) {
    this.onTouch = fn;
  }

  /**
   * When focus on the input range, show bubble and ticks
   */
  onFocusFunction() {
    this.bubbleToShow = true;
    this.ticksToShow = true;
  }

  /**
   * When value of input changes, calculates the position where the bubble is to go
   */
  onChangeFunction() {
    const val = this.val;
    const min = this.minValue;
    const max = this.maxValue;
    const newVal = Number(((val - min) * 100) / (max - min));

    // Sorta magic numbers based on size of the native UI thumb
    this.bubbleStyle = String(newVal) + '%';
  }

  /**
   * When the input range is not in focus anymore, stop showing the ticks and bubble
   */
  onBlurFunction() {
    this.bubbleToShow = false;
    this.ticksToShow = false;
  }

  // eslint-disable-next-line jsdoc/require-returns
  /**
   * Create a table from a certain range (in order to use a ngFor directive in html)
   *
   * @param number
   * The length of the array to be created
   */
  createRange(number: number) {
    // return new Array(number);
    return new Array(number).fill(0).map((n, index) => index + 1);
  }
}
