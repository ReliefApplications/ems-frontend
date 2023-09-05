import {
  Component,
  forwardRef,
  HostListener,
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
  /**
   * Step value of each tick
   */
  @Input() step = 1;

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

  /**
   * Listener for focusout event
   */
  @HostListener('focusout', [])
  onFocusOut() {
    this.hideSliderProperties();
  }

  /**
   * Listener for focusin event
   */
  @HostListener('focusin', [])
  onFocus() {
    this.showSliderProperties();
  }

  ngOnInit(): void {
    this.range = this.createRange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // this.minValue = changes['minValue'].currentValue ?? this.minValue;
    // this.maxValue = changes['maxValue'].currentValue ?? this.maxValue;
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
  registerOnChange(fn: (value: number) => void) {
    if (!this.onChange) {
      this.onChange = fn;
    }
  }

  /**
   * Record on touch
   *
   * @param fn event that took place
   */
  registerOnTouched(fn: () => void) {
    if (!this.onTouch) {
      this.onTouch = fn;
    }
  }

  /**
   * When focus on the input range, show bubble and ticks
   */
  showSliderProperties() {
    this.bubbleToShow = true;
    this.ticksToShow = true;
  }

  /**
   * When the input range is not in focus anymore, stop showing the ticks and bubble
   */
  hideSliderProperties() {
    this.bubbleToShow = false;
    this.ticksToShow = false;
  }

  /**
   * When hover the component, show ticks (did not do in class cause would create conflicts with the focus thing)
   */
  showTicks() {
    this.ticksToShow = true;
  }

  /**
   * When leaves hover the component, if bubble is not showing (no focus), strop displaying ticks
   */
  hideTicks() {
    if (!this.bubbleToShow) {
      this.ticksToShow = false;
    }
  }

  /**
   * When value of input changes, calculates the position where the bubble is to go
   *
   * @param value The value from the slider
   */
  onChangeFunction(value: EventTarget | null) {
    const newValue = +((value as HTMLInputElement)?.value ?? value);
    if (newValue !== this.currentValue) {
      this.currentValue = isNaN(newValue) ? 0 : newValue;
      const min = this.minValue;
      const max = this.maxValue;
      const newVal = Number(((this.currentValue - min) * 100) / (max - min));
      if (this.onChange && this.onTouch) {
        this.onChange(this.currentValue);
        this.onTouch();
      }
      // Sorta magic numbers based on size of the native UI thumb
      this.bubbleStyle = String(newVal) + '%';
    }
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
