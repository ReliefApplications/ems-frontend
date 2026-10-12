import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, SnackbarService, TooltipModule } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { SurveyModel } from 'survey-core';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { Record as RecordModel } from '../../models/record.model';
import { Form } from '../../models/form.model';

/**
 * Shared button to open list of available record drafts.
 */
@Component({
  selector: 'shared-draft-record',
  standalone: true,
  imports: [CommonModule, ButtonModule, TooltipModule, TranslateModule],
  templateUrl: './draft-record.component.html',
  styleUrls: ['./draft-record.component.scss'],
})
export class DraftRecordComponent extends UnsubscribeComponent {
  /** Survey model */
  @Input() survey!: SurveyModel;
  /** Form used by the draft list and preview. */
  @Input() form!: Form;
  /** Optional hook before opening drafts list. Return false to cancel. */
  @Input() beforeOpenDrafts?: () => Promise<boolean> | boolean;
  /** Emit event when selecting draft */
  @Output() loadDraft: EventEmitter<string> = new EventEmitter();

  /**
   * Shared button to open list of available record drafts.
   *
   * @param dialog This is the Angular Dialog service
   * @param snackBar Shared snackbar service
   */
  constructor(public dialog: Dialog, private snackBar: SnackbarService) {
    super();
  }

  /**
   * Open draft list.
   */
  public async onOpenDrafts(): Promise<void> {
    try {
      const beforeOpenDrafts = await this.beforeOpenDrafts?.();
      if (beforeOpenDrafts === false) return;
      const { DraftRecordListModalComponent } = await import(
        '../draft-record-list-modal/draft-record-list-modal.component'
      );
      const dialogRef = this.dialog.open(DraftRecordListModalComponent, {
        data: { form: this.form },
      });
      dialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: unknown) => {
          const record = value as RecordModel | undefined;
          if (record?.id) {
            this.survey.data = record.data;
            this.loadDraft.emit(record.id);
          }
        });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.snackBar.openSnackBar(message, { error: true });
    }
  }
}
