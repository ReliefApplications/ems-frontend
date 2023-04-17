import { Component, HostBinding, Input } from '@angular/core';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { ButtonCategory } from './enums/button-category.enum';
import { ButtonVariant } from './enums/button-variant.enum';
import { Subject } from 'rxjs';
import { ButtonSize } from './enums/button-size.enum';

/**
 * UI Button Component
 */
@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() icon = '';
  @Input() iconPosition: ButtonIconPosition = ButtonIconPosition.PREFIX;
  @Input() category: ButtonCategory = ButtonCategory.PRIMARY;
  @Input() size: ButtonSize = ButtonSize.MEDIUM;
  @Input() variant: ButtonVariant = ButtonVariant.DEFAULT;
  @Input() loading = false;
  @HostBinding('class.disabled')
  @Input()
  disabled = false;

  buttonIconPosition = ButtonIconPosition;
  buttonCategory = ButtonCategory;
  buttonSize = ButtonSize;
  buttonVariant = ButtonVariant;

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
        return '';
        // switch (this.variant) {
        //   case ButtonVariant.DEFAULT: {
        //     return SpinnerVariant.PRIMARY;
        //   }
        //   default: {
        //     return SpinnerVariant.LIGHT;
        //   }
        // }
      }
    }
  }
}
