import { Component, Input } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';

/**
 * Component used in the card-modal-settings for configuring some display settings.
 */
@Component({
  selector: 'safe-display-tab',
  templateUrl: './display-tab.component.html',
  styleUrls: ['./display-tab.component.scss'],
})
export class SafeDisplayTabComponent {
  @Input() form!: UntypedFormGroup;

  /** @returns pageToLink */
  get cardPageToLink(): AbstractControl | null {
    return this.form.get('card.pageToLink');
  }
}
