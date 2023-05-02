import { Component, HostBinding, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { SpinnerVariant } from '../spinner/spinner-variant.enum';
import { ButtonCategory } from './button-category.enum';
import { ButtonSize } from './button-size.enum';
import { ButtonVariant } from './button-variant.enum';

/**
 * Button component.
 */
@Component({
  selector: 'safe-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class SafeButtonComponent {
  @Input() category: ButtonCategory | string = ButtonCategory.PRIMARY;

  @Input() size: ButtonSize | string = ButtonSize.MEDIUM;

  @Input() variant: ButtonVariant | string = ButtonVariant.DEFAULT;

  @Input() isIcon = false;

  @Input() fontSet!: string;

  @HostBinding('class.disabled')
  @Input()
  disabled = false;

  @Input() loading = false;

  @Input() icon = '';

  @Input() ariaLabel = '';

  public emittedEventSubject: Subject<string> = new Subject();

  /**
   * Return material color of button, from variant.
   *
   * @returns material color, if any
   */
  get color(): string {
    switch (this.variant) {
      case ButtonVariant.PRIMARY: {
        return 'primary';
      }
      case ButtonVariant.DANGER: {
        return 'warn';
      }
      default: {
        return '';
      }
    }
  }

  /**
   * Return variant of spinner
   *
   * @returns spinner variant
   */
  get spinnerVariant(): string {
    switch (this.category) {
      case ButtonCategory.PRIMARY: {
        return this.variant;
      }
      case ButtonCategory.TERTIARY: {
        return this.variant;
      }
      default: {
        switch (this.variant) {
          case ButtonVariant.DEFAULT: {
            return SpinnerVariant.PRIMARY;
          }
          default: {
            return SpinnerVariant.LIGHT;
          }
        }
      }
    }
  }
}
