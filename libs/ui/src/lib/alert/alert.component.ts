import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
} from '@angular/core';
import { AlertVariant } from './types/alert-variant';
import { Variant } from '../types/variant';

/** UI Alert Component. */
@Component({
  selector: 'ui-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'default';
  @Input() closable = false;
  @Input() border = false;
  @Input() showIcon = true;

  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() close = new EventEmitter<Event>();

  /**
   * UI Alert Component
   *
   * @param host Angular element ref
   */
  constructor(private host: ElementRef<HTMLElement>) {}

  /** Closes the alert and emits an event */
  onClose() {
    setTimeout(() => {
      this.close.emit();
    }, 300);
    this.host.nativeElement.remove();
  }

  /** @returns icon */
  get resolveIcon(): string {
    switch (this.variant) {
      case 'default':
        return 'info';
      case 'primary':
        return 'description';
      case 'success':
        return 'check_circle';
      case 'danger':
        return 'dangerous';
      case 'warning':
        return 'warning';
    }
  }

  /** @returns button variant */
  get resolveButtonVariant(): Variant {
    switch (this.variant) {
      case 'default':
        return 'grey';
      case 'primary':
        return 'primary';
      case 'success':
        return 'success';
      case 'danger':
        return 'danger';
      case 'warning':
        return 'warning';
    }
  }

  /** @returns get alert classes */
  get resolveAlertClasses(): string[] {
    const classes: string[] = [];
    const borderClasses = ['border-l-4'];
    switch (this.variant) {
      case 'default': {
        classes.push('bg-gray-50');
        classes.push('text-gray-800');
        if (this.border) {
          classes.push(...borderClasses);
          classes.push('border-gray-400');
        }
        break;
      }
      case 'primary': {
        classes.push('bg-primary-50');
        classes.push('text-primary-800');
        if (this.border) {
          classes.push(...borderClasses);
          classes.push('border-primary-400');
        }
        break;
      }
      case 'success': {
        classes.push('bg-green-50');
        classes.push('text-green-800');
        if (this.border) {
          classes.push(...borderClasses);
          classes.push('border-green-400');
        }
        break;
      }
      case 'danger': {
        classes.push('bg-red-50');
        classes.push('text-red-800');
        if (this.border) {
          classes.push(...borderClasses);
          classes.push('border-red-400');
        }
        break;
      }
      case 'warning': {
        classes.push('bg-yellow-50');
        classes.push('text-yellow-800');
        if (this.border) {
          classes.push(...borderClasses);
          classes.push('border-yellow-400');
        }
        break;
      }
    }
    return classes;
  }
}
