import { Component } from '@angular/core';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { v4 as uuidv4 } from 'uuid';
import localForage from 'localforage';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';
import { SurveyModule } from 'survey-angular-ui';

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
  ],
})
export class ResourceModalComponent extends FormModalComponent {
  /**
   * We override this method to not directly save new records
   *
   * @param survey current survey
   */
  public override async onUpdate(survey: any): Promise<void> {
    // If question propriety alwaysCreateRecord set to true, don't use override method and create new record
    if (this.data.alwaysCreateRecord) {
      super.onUpdate(survey);
    } else {
      if (this.data.recordId) {
        await this.formHelpersService.uploadFiles(
          survey,
          this.temporaryFilesStorage,
          this.form?.id
        );
        if (this.isMultiEdition) {
          this.updateMultipleData(this.data.recordId, survey);
        } else {
          this.updateData(this.data.recordId, survey);
        }
      } else {
        await this.formHelpersService.uploadFiles(
          survey,
          this.temporaryFilesStorage,
          this.form?.id
        );
        const temporaryId = uuidv4();
        await localForage.setItem(
          temporaryId.toString(),
          JSON.stringify({
            data: survey.parsedData ?? survey.data,
            template: this.data.template,
          })
        ); //We save the question temporarily before applying the mutation.
        this.ngZone.run(() => {
          this.dialogRef.close({
            template: this.data.template,
            data: {
              id: temporaryId,
              data: survey.parsedData ?? survey.data,
            },
          } as any);
        });
      }
      survey.showCompletedPage = true;
    }
  }
}
