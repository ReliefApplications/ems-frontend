import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from '@oort-front/ui';
import { EmailNotificationSchedule } from '../../../../models/email-notifications.model';
import { isEmailNotificationScheduled } from '../../email-list.constants';

/** Displays whether an email notification is delivered manually or by schedule. */
@Component({
  selector: 'shared-email-delivery',
  standalone: true,
  imports: [CommonModule, ChipModule, TranslateModule],
  template: `
    <ui-chip
      *ngIf="scheduled; else manualDelivery"
      class="!rounded-lg"
      variant="primary"
    >
      {{ 'components.email.notification.scheduled' | translate }}
    </ui-chip>
    <ng-template #manualDelivery>
      <ui-chip class="!rounded-lg" variant="grey">
        {{ 'components.email.notification.manual' | translate }}
      </ui-chip>
    </ng-template>
  `,
})
export class EmailDeliveryComponent {
  /** Notification scheduling configuration. */
  @Input() schedule?: EmailNotificationSchedule | null;

  /** @returns Whether scheduled delivery is enabled. */
  public get scheduled(): boolean {
    return isEmailNotificationScheduled(this.schedule);
  }
}
