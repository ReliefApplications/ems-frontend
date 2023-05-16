import { Component, HostBinding, Input } from '@angular/core';
import { ButtonIconPosition } from './enums/button-icon-position.enum';
import { Category } from '../shared/category.enum';
import { Variant } from '../shared/variant.enum';
import { Subject } from 'rxjs';
import { Size } from '../shared/size.enum';

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
  @Input() category: Category = Category.PRIMARY;
  @Input() size: Size = Size.MEDIUM;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() isIcon = false;
  @Input() loading = false;
  @HostBinding('class.disabled')
  @Input()
  disabled = false;
  @Input() fontSet = false;

  buttonIconPosition = ButtonIconPosition;
  buttonCategory = Category;
  buttonSize = Size;
  buttonVariant = Variant;

  public emittedEventSubject: Subject<string> = new Subject();

  /**
   * Map icon size as number for Size enum
   *
   * @returns size as number
   */
  get iconSize(): number {
    switch (this.size) {
      case Size.SMALL:
        return 18;
      case Size.LARGE:
        return 24;
      default:
        return 21;
    }
  }

  /** @returns general resolved classes and variant for button*/
  get resolveButtonClasses(): string[] {
    const classes = [];
    classes.push(this.isIcon ? 'ui-button-icon' : 'ui-button');
    classes.push(this.category);
    classes.push(this.size);
    classes.push(
      'button-' +
        (this.variant === Variant.DEFAULT
          ? Variant.PRIMARY
          : this.variant === Variant.LIGHT
          ? Variant.GREY
          : this.variant)
    );
    if ((this.icon || this.loading) && !this.isIcon) {
      classes.push('inline-flex items-center gap-x-2');
    }
    if (this.disabled) {
      classes.push('opacity-70');
    }
    return classes;
  }
}
