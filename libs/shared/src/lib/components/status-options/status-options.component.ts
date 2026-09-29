import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ChipModule } from '@oort-front/ui';

/**
 * Status option types
 */
export const statusOptions = [
  'active',
  'pending',
  'archived',
  'draft',
] as const;
export type StatusOptions = (typeof statusOptions)[number];

/**
 * Status option type chip list
 */
@Component({
  selector: 'shared-status-options',
  standalone: true,
  imports: [CommonModule, ChipModule, TranslateModule],
  template: `<div uiChipList>
    <ui-chip
      class="!rounded-lg"
      variant="success"
      *ngIf="displayStatus === 'active'"
    >
      {{ 'common.status_active' | translate | titlecase }}
    </ui-chip>
    <ui-chip
      class="!rounded-lg"
      variant="warning"
      *ngIf="displayStatus === 'pending'"
    >
      {{ 'common.status_pending' | translate | titlecase }}
    </ui-chip>
    <ui-chip
      class="!rounded-lg"
      variant="danger"
      *ngIf="displayStatus === 'archived'"
    >
      {{ 'common.status_archived' | translate | titlecase }}
    </ui-chip>
    <ui-chip
      class="!rounded-lg"
      variant="warning"
      *ngIf="displayStatus === 'draft'"
    >
      {{ 'common.status_draft' | translate | titlecase }}
    </ui-chip>
  </div>`,
})
export class StatusOptionsComponent {
  /** Status to display the selected one among the status options */
  @Input() status!: StatusOptions;
  /** Whether a draft should take precedence over the lifecycle status. */
  @Input() isDraft = false;

  /**
   * Status represented by the chip.
   *
   * @returns Draft when applicable, otherwise the lifecycle status
   */
  public get displayStatus(): StatusOptions {
    return this.isDraft ? 'draft' : this.status;
  }
}
