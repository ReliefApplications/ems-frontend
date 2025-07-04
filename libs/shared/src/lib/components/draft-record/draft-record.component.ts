import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { SurveyModel } from 'survey-core';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
export class DraftRecordComponent {
  /** Survey model */
  @Input() survey!: SurveyModel;
  /** Form input */
  @Input() formId!: string;
  /** Emit event when selecting draft */
  @Output() loadDraft: EventEmitter<string> = new EventEmitter();
  /** Component destroy ref */
  private destroyRef = inject(DestroyRef);

  /**
   * Shared button to open list of available record drafts.
   *
   * @param dialog This is the Angular Dialog service.
   */
  constructor(public dialog: Dialog) {}

  /**
   * Open draft list.
   */
  public async onOpenDrafts(): Promise<void> {
    // Lazy load modal
    const { DraftRecordListModalComponent } = await import(
      '../draft-record-list-modal/draft-record-list-modal.component'
    );
    const dialogRef = this.dialog.open(DraftRecordListModalComponent, {
      data: {
        form: this.formId,
      },
    });
    dialogRef.closed
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: any) => {
        if (value) {
          this.survey.data = value.data;
          this.loadDraft.emit(value.id);
        }
      });
  }
}
