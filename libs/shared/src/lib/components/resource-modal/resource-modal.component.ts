import { Component } from '@angular/core';
import { FormModalComponent } from '../form-modal/form-modal.component';
// import { v4 as uuidv4 } from 'uuid';
// import localForage from 'localforage';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';
import { SurveyModule } from 'survey-angular-ui';
import { DraftRecordComponent } from '../draft-record/draft-record.component';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { RecordSummaryModule } from '../record-summary/record-summary.module';

/**
 * Factory for creating scroll strategy
 *
 * @param overlay The overlay
 * @returns A function that returns a block scroll strategy
 */
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

/**
 * Component to create a record for a resource question without directly saving it
 */
@Component({
  standalone: true,
  selector: 'shared-resource-modal',
  templateUrl: '../form-modal/form-modal.component.html',
  styleUrls: ['../form-modal/form-modal.component.scss'],
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    RecordSummaryModule,
    FormActionsModule,
    TranslateModule,
    DialogModule,
    SpinnerModule,
    TabsModule,
    SurveyModule,
    DraftRecordComponent,
  ],
})
export class ResourceModalComponent extends FormModalComponent {
  /**
   * We override this method to not directly save new records
   *
   * @param survey current survey
   */
  public override async onUpdate(survey: any): Promise<void> {
    if (this.data.recordId) {
      if (this.isMultiEdition) {
        this.updateMultipleData(this.data.recordId, survey);
      } else {
        this.updateData(this.data.recordId, survey);
      }
    } else {
      const callback = (details: any) => {
        this.ngZone.run(() => {
          this.dialogRef.close({
            template: this.data.template,
            data: {
              id: details.id,
              data: survey.data,
            },
          } as any);
        });
      };

      this.formHelpersService.saveAsDraft(
        this.survey,
        this.form?.id as string,
        this.lastDraftRecord,
        callback
      );
    }
  }
}
