import { Component, HostBinding, Input } from '@angular/core';
import { ButtonIconPosition } from './types/button-icon-position';
import { Category } from '../types/category';
import { Variant } from '../types/variant';
import { Subject } from 'rxjs';
import { Size } from '../types/size';

/**
 * UI Button Component.
 * Encapsulate a html button.
 * Button can have various shapes / colors / sizes.
 * It can be only icon, or have one as prefix / suffix of its text.
 */
@Component({
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  /** Button Icon */
  @Input() icon = '';
  /** Icon position, either before or after text */
  @Input() iconPosition: ButtonIconPosition = 'prefix';
  /** Button category, define shape */
  @Input() category: Category = 'primary';
  /** Button size */
  @Input() size: Size = 'medium';
  /** Button variant, define color */
  @Input() variant: Variant = 'primary';
  /** Button background, set to true to render a white background */
  @Input() background = false;
  /** Is button only icon */
  @Input() isIcon = false;
  /** Should button appear as block */
  @HostBinding('class.!w-full')
  @Input()
  isBlock = false;
  /** Loading indicator */
  @Input() loading = false;
  /** Disable interaction */
  @HostBinding('class.disabled')
  @Input()
  disabled = false;
  /** Is button outlined */
  @Input() isOutlined = false;
  /** Emit click event */
  public emittedEventSubject: Subject<string> = new Subject();

  /**
   * Map icon size as number for Size enum
   *
   * @returns size as number
   */
  get iconSize(): number {
    switch (this.size) {
      case 'small':
        return 18;
      case 'large':
        return 24;
      default:
        return 21;
    }
  }

  /** @returns general resolved classes and variant for button*/
  get resolveButtonClasses(): string[] {
    const classes = [];
    if (this.isBlock) classes.push('!w-full');
    classes.push(this.isIcon ? 'ui-button-icon' : 'ui-button');
    classes.push(this.category);
    classes.push(this.size);
    classes.push('button-' + this.variant);
    if ((this.icon || this.loading) && !this.isIcon) {
      classes.push('inline-flex items-center gap-x-2');
    }
    if (this.disabled) {
      classes.push('opacity-70');
    }
    if (this.background) {
      classes.push('bg-white');
    }
    return classes;
  }
}
