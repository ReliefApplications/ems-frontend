import { Component, Input } from '@angular/core';
import { ToggleType } from './enums/toggle-type.enum';
import { ToggleLabel } from './interfaces/toggle-label.interface';
import { ToggleIcon } from './interfaces/toggle-icon.interface';
import { Subject } from 'rxjs';

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

  public enabled = false;
  public toggleTypes = ToggleType;

  public emittedEventSubject: Subject<string> = new Subject();

  /** Triggers any action given on click in the toggle element */
  triggerAction() {
    this.enabled = !this.enabled;
    this.emittedEventSubject.next('click');
  }
}
