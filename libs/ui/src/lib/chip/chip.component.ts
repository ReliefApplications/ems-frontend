import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { Variant } from '../types/variant';

/**
 * UI Chip Component
 * Display a chip with text and optional remove button.
 */
@Component({
  selector: 'ui-chip',
  templateUrl: './chip.component.html',
  styleUrls: ['./chip.component.scss'],
})
export class ChipComponent implements OnDestroy {
  /** The value or label of the chip. */
  @Input() value = '';
  /** Boolean indicating whether the chip is removable. */
  @Input() removable = false;
  /** The variant or style of the chip. */
  @Input() variant: Variant = 'default';
  /** Boolean indicating whether the chip is disabled. */
  @Input() disabled = false;
  /** Event emitter for when the chip is removed. */
  @Output() removed = new EventEmitter<void>();
  /** Timeout to onClick */
  private onClickTimeoutListener!: NodeJS.Timeout;

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
          classes.push('bg-green-550 hover:bg-green-650 text-white');
          break;
        case 'danger':
          classes.push('bg-red-550 hover:bg-red-650 text-white');
          break;
        case 'warning':
          classes.push('bg-yellow-550 hover:bg-yellow-650 text-white');
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
    if (this.onClickTimeoutListener) {
      clearTimeout(this.onClickTimeoutListener);
    }
    this.onClickTimeoutListener = setTimeout(
      () => (chip.style.transform = 'scale(1)'),
      200
    );
  }

  ngOnDestroy(): void {
    if (this.onClickTimeoutListener) {
      clearTimeout(this.onClickTimeoutListener);
    }
  }
}
