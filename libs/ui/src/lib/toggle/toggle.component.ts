import { Component, Input } from '@angular/core';
import { ToggleType } from './enums/toggle-type.enum';
import { ToggleLabel } from './interfaces/toggle-label.interface';
import { ToggleIcon } from './interfaces/toggle-icon.interface';
import { Subject } from 'rxjs';
import { Variant } from '../shared/variant.enum';

/**
 * UI Toggle component
 */
@Component({
  selector: 'ui-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  @Input() type: ToggleType = ToggleType.SIMPLE;
  @Input() icon!: ToggleIcon;
  @Input() label!: ToggleLabel;
  @Input() variant: Variant = Variant.PRIMARY;

  public toggleTypes = ToggleType;
  public toggleVariant = Variant;

  public enabled = false;
  public emittedEventSubject: Subject<string> = new Subject();

  /** @returns general toggle classes and variant */
  get toggleClasses(): string[] {
    const classes = [];
    classes.push('focus-' + this.variant);
    if (this.type === this.toggleTypes.SIMPLE) {
      classes.push('button-simple');
      if (!this.enabled) {
        classes.push('bg-gray-200');
      } else {
        classes.push('toggle-' + this.variant);
      }
    } else {
      classes.push('button-short');
    }
    return classes;
  }

  /** @returns shot toggle classes and variant */
  get shortToggleClasses(): string[] {
    const classes = [];
    if (!this.enabled) {
      classes.push('bg-gray-200');
    } else {
      classes.push('toggle-' + this.variant);
    }
    return classes;
  }

  /** Triggers any action given on click in the toggle element */
  triggerAction() {
    this.enabled = !this.enabled;
    this.emittedEventSubject.next('click');
  }
}
