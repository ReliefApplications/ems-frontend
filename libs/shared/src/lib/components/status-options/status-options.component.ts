import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from '@oort-front/ui';

/**
 * Status option types
 */
export const statusOptions = ['active', 'pending', 'archived'] as const;
export type StatusOptions = (typeof statusOptions)[number];

/**
 * Status option type chip list
 */
@Component({
  selector: 'shared-status-options',
  standalone: true,
  imports: [CommonModule, ChipModule, TranslateModule],
  template: `<div uiChipList>
    <ui-chip class="!rounded-lg" variant="success" *ngIf="status === 'active'">
      {{ 'common.status_active' | translate | titlecase }}
    </ui-chip>
    <ui-chip class="!rounded-lg" variant="warning" *ngIf="status === 'pending'">
      {{ 'common.status_pending' | translate | titlecase }}
    </ui-chip>
    <ui-chip class="!rounded-lg" variant="danger" *ngIf="status === 'archived'">
      {{ 'common.status_archived' | translate | titlecase }}
    </ui-chip>
  </div>`,
})
export class StatusOptionsComponent {
  /** Status to display the selected one among the status options */
  @Input() status!: StatusOptions;
}
