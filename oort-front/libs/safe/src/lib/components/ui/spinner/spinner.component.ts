import { Component, Input, OnInit } from '@angular/core';
import { SpinnerSize } from './spinner-size.enum';
import { SpinnerVariant } from './spinner-variant.enum';

/**
 * Custom spinner component used when loading more complex components
 */
@Component({
  selector: 'safe-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SafeSpinnerComponent implements OnInit {
  @Input() size: SpinnerSize | string = SpinnerSize.MEDIUM;

  @Input() variant: SpinnerVariant | string = SpinnerVariant.DEFAULT;

  /**
   * Gets the diameter based on the size passed to the component.
   *
   * @returns Returns a number with the correspondant diameter.
   */
  get diameter(): number {
    switch (this.size) {
      case SpinnerSize.SMALL: {
        return 18;
      }
      case SpinnerSize.MEDIUM: {
        return 24;
      }
      default: {
        return 24;
      }
    }
  }

  /**
   * Gets the color based on the variant passed to the component.
   *
   * @returns Returns a string with the correspondant color.
   */
  get color(): string {
    switch (this.variant) {
      case SpinnerVariant.PRIMARY: {
        return 'primary';
      }
      case SpinnerVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  /**
   * Constructor for safe-spinner component.
   */
  constructor() {}

  ngOnInit(): void {}
}
