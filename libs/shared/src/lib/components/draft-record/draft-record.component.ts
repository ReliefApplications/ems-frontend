import { Component, Input } from '@angular/core';
import { FormHelpersService } from '../../services/form-helper/form-helper.service';
import { CommonModule } from '@angular/common';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { Dialog } from '@angular/cdk/dialog';
import { SurveyModel } from 'survey-core';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

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
  /** Form input */
  @Input() formId!: string;

  /**
   * Shared button to open list of available record drafts.
   *
   * @param dialog This is the Angular Dialog service.
   * @param formHelpersService This is the service that will handle forms.
   */
  constructor(
    public dialog: Dialog,
    private formHelpersService: FormHelpersService
  ) {
    super();
  }

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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.survey.data = value.data;
        this.formHelpersService.lastDraftRecord = value.id;
        this.formHelpersService.disableSaveAsDraft = true;
      }
    });
  }
}
