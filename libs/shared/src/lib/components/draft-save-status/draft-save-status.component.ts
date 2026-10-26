import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, SpinnerModule } from '@oort-front/ui';
import { DateModule } from '../../pipes/date/date.module';

/**
 * Draft save status of a form: a discreet "saving" text while a draft save
 * ( manual or automatic ) is in progress, the time of the latest successful
 * save otherwise. Shown next to the form actions.
 */
@Component({
  selector: 'shared-draft-save-status',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    SpinnerModule,
    DateModule,
  ],
  templateUrl: './draft-save-status.component.html',
})
export class DraftSaveStatusComponent {
  /** Whether a draft save is in progress */
  @Input() saving = false;
  /** Time of the latest successful draft save, if any */
  @Input() savedAt?: Date;
}
