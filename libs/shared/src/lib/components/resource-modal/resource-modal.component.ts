import { Component, inject } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { RecordQueryResponse } from '../../models/record.model';
import { GET_RESOURCE_QUESTION_DRAFT_RECORD } from '../../survey/graphql/queries';
import { FormModalComponent } from '../form-modal/form-modal.component';
// import { v4 as uuidv4 } from 'uuid';
// import localForage from 'localforage';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  AlertModule,
  ButtonModule,
  DialogModule,
  IconModule,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';
import { SurveyModule } from 'survey-angular-ui';
import { DraftRecordComponent } from '../draft-record/draft-record.component';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { DateModule } from '../../pipes/date/date.module';
import { DraftSaveStatusComponent } from '../draft-save-status/draft-save-status.component';

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
    AlertModule,
    ButtonModule,
    IconModule,
    RecordSummaryModule,
    TranslateModule,
    DialogModule,
    SpinnerModule,
    TabsModule,
    SurveyModule,
    DraftRecordComponent,
    DateModule,
    DraftSaveStatusComponent,
  ],
})
export class ResourceModalComponent extends FormModalComponent {
  /** Apollo client, to read back the saved draft record */
  private readonly draftRecordApollo = inject(Apollo);

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
      const close = (data: any) =>
        this.ngZone.run(() => {
          this.dialogRef.close({
            template: this.data.template,
            data: { id: data.id, data: data.data },
          } as any);
        });
      const callback = (details: any) => {
        // The answers do not contain the calculated fields (computed by the
        // back-end), and the question's display field may be one of them:
        // read the saved draft so the new choice shows its text, not its id
        this.draftRecordApollo
          .query<RecordQueryResponse>({
            query: GET_RESOURCE_QUESTION_DRAFT_RECORD,
            variables: { id: details.id },
            fetchPolicy: 'no-cache',
          })
          .subscribe({
            next: ({ data }) =>
              close({
                id: details.id,
                data: { ...survey.data, ...(data?.record?.data || {}) },
              }),
            error: () => close({ id: details.id, data: survey.data }),
          });
      };

      this.formHelpersService.saveAsDraft(
        this.survey,
        this.form?.id as string,
        this.temporaryFilesStorage,
        this.lastDraftRecord,
        callback
      );
    }
  }
}
