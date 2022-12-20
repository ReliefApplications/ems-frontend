import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeRecordHistoryModalModule } from '../record-history-modal/record-history-modal.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';
import { SurveyModule } from 'survey-angular-ui';

/**
 * SafeFormModalModule is a class used to manage all the modules and components
 * related to modals containing forms.
 */
@NgModule({
  declarations: [SafeFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordHistoryModalModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
    SafeModalModule,
    SurveyModule,
  ],
  exports: [SafeFormModalComponent],
})
export class SafeFormModalModule {}
