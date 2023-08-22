import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Variant } from '../types/variant';

/**
 * UI Chip Component
 */
@Component({
  selector: 'ui-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
  @Input() value = '';
  @Input() removable = false;
  @Input() variant: Variant = 'default';
  @Input() disabled = false;

  @Output() removed = new EventEmitter<void>();

  /** @returns general chip classes and variant */
  get chipClasses(): string[] {
    const classes: string[] = [];
    // Disable state
    if (this.disabled) {
      classes.push('opacity-70 bg-gray-300 text-gray-400 pointer-events-none');
    } else {
      classes.push('cursor-pointer');
      // Variants
      switch (this.variant) {
        case 'default':
        case 'grey':
          classes.push('bg-gray-300 hover:bg-gray-400 text-gray-500');
          break;
        case 'primary':
          classes.push('bg-primary-100 hover:bg-primary-200 text-primary-400');
          break;
        case 'success':
          classes.push('bg-green-100 hover:bg-green-200 text-green-400');
          break;
        case 'danger':
          classes.push('bg-red-100 hover:bg-red-200 text-red-400');
          break;
        case 'warning':
          classes.push('bg-orange-100 hover:bg-orange-200 text-orange-400');
          break;
        default:
          break;
      }
    }
    return classes;
  }

  /**
   * Add animation on click in the chip
   *
   * @param event mouse event of the chip clicked
   */
  onClick(event: MouseEvent): void {
    if (this.disabled) {
      return;
    }
    const chip = event.currentTarget as HTMLElement;
    chip.style.transform = 'scale(0.95)';
    setTimeout(() => (chip.style.transform = 'scale(1)'), 200);
  }
}
