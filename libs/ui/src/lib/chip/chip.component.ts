import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Variant } from '../shared/variant.enum';

/**
 * UI Chip Component
 */
@Component({
  selector: 'ui-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent {
  @Input() value!: string;
  @Input() removable = false;
  @Input() variant: Variant = Variant.DEFAULT;
  @Input() disabled = false;

  @Output() removed = new EventEmitter<void>();

  public chipVariant = Variant;

  /** @returns general chip classes and variant */
  get chipClasses(): string[] {
    const classes = [];
    // Disable state
    if (this.disabled) {
      classes.push('opacity-40 bg-gray-200 text-gray-400');
    } else {
      classes.push('cursor-pointer');
      // Variants
      switch (this.variant) {
        case this.chipVariant.DEFAULT:
          classes.push('bg-gray-300 hover:bg-gray-400 text-gray-500');
          break;
        case this.chipVariant.PRIMARY:
          classes.push('bg-primary-100 hover:bg-primary-200 text-primary-400');
          break;
        case this.chipVariant.SUCCESS:
          classes.push('bg-green-100 hover:bg-green-200 text-green-400');
          break;
        case this.chipVariant.DANGER:
          classes.push('bg-red-100 hover:bg-red-200 text-red-400');
          break;
        default:
          break;
      }
    }
    return classes;
  }

  // to test click animation
  click(event: MouseEvent): void {
    const chip = event.currentTarget as HTMLElement;
    chip.style.transform = 'scale(0.95)';
    setTimeout(() => (chip.style.transform = 'scale(1)'), 200);
  }
}
