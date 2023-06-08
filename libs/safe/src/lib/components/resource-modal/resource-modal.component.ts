import { Component } from '@angular/core';
import { SafeFormModalComponent } from '../form-modal/form-modal.component';
import { v4 as uuidv4 } from 'uuid';
import localForage from 'localforage';
import { MAT_TOOLTIP_SCROLL_STRATEGY } from '@angular/material/tooltip';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DialogModule,
  IconModule,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';

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
  selector: 'safe-resource-modal',
  templateUrl: '../form-modal/form-modal.component.html',
  styleUrls: ['../form-modal/form-modal.component.scss'],
  providers: [
    {
      provide: MAT_TOOLTIP_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
    DialogModule,
    SpinnerModule,
    TabsModule,
  ],
})
export class SafeResourceModalComponent extends SafeFormModalComponent {
  /**
   * Calls the complete method of the survey if no error.
   */
  public override submit(): void {
    this.saving = true;
    if (!this.survey?.hasErrors()) {
      this.survey?.completeLastPage();
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant('models.form.notifications.savingFailed'),
        { error: true }
      );
      this.saving = false;
    }
  }

  /**
   * We override this method to not directly save new records
   *
   * @param survey current survey
   */
  public override async onUpdate(survey: any): Promise<void> {
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
        JSON.stringify({ data: survey.data, template: this.data.template })
      ); //We save the question temporarily before applying the mutation.
      this.ngZone.run(() => {
        this.dialogRef.close({
          template: this.data.template,
          data: {
            id: temporaryId,
            data: survey.data,
          },
        } as any);
      });
    }
    survey.showCompletedPage = true;
  }
}
