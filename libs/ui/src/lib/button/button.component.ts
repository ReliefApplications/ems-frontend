import { Component, HostBinding, Input } from '@angular/core';
import { ButtonIconPosition } from './types/button-icon-position';
import { Category } from '../types/category';
import { Variant } from '../types/variant';
import { Subject } from 'rxjs';
import { Size } from '../types/size';

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
  @Input() iconPosition: ButtonIconPosition = 'prefix';
  @Input() category: Category = 'primary';
  @Input() size: Size = 'medium';
  @Input() variant: Variant = 'default';
  @Input() isIcon = false;
  @HostBinding('class.flex')
  @Input()
  isBlock = false;
  @Input() loading = false;
  @HostBinding('class.disabled')
  @Input()
  disabled = false;
  @Input() isOutlined = false;

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
    if (this.isBlock) classes.push('w-full');
    classes.push(this.isIcon ? 'ui-button-icon' : 'ui-button');
    classes.push(this.category);
    classes.push(this.size);
    classes.push(
      'button-' + (this.variant === 'default' ? 'primary' : this.variant)
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
