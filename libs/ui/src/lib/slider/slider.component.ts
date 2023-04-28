import {
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class SliderComponent
  implements OnInit, OnChanges, ControlValueAccessor
{
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
  // Slider range
  range: number[] = [];
  //Value of the slider
  currentValue = this.minValue;
  onChange!: (value: number) => void;
  onTouch!: () => void;

  ngOnInit(): void {
    this.range = this.createRange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.minValue = changes['minValue'].currentValue ?? this.minValue;
    this.maxValue = changes['maxValue'].currentValue ?? this.maxValue;
    //If one of these two changes, update slider range
    if (changes['minValue']?.currentValue || changes['maxValue'].currentValue) {
      this.createRange();
    }
  }

  /**
   * Actually change the value of value
   *
   * @param value value to replace
   */
  writeValue(value: any): void {
    this.onChangeFunction(value);
  }

  /**
   * Record on change
   *
   * @param fn event that took place
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * Record on touch
   *
   * @param fn event that took place
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
   *
   * @param value The value from the slider
   */
  onChangeFunction(value: EventTarget) {
    this.currentValue = +(value as HTMLInputElement)?.value;
    const min = this.minValue;
    const max = this.maxValue;
    const newVal = Number(
      ((+(value as HTMLInputElement)?.value - min) * 100) / (max - min)
    );
    if (this.onChange && this.onTouch) {
      this.onChange(+(value as HTMLInputElement)?.value);
      this.onTouch();
    }
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

  /**
   * Create a table from a certain range (in order to use a ngFor directive in html)
   *
   * @returns new array with given range
   */
  createRange(): number[] {
    return new Array(this.maxValue - this.minValue + 1)
      .fill(0)
      .map((n, index) => index + 1);
  }
}
