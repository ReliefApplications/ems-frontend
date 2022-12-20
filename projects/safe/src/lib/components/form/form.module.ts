import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { SafeFormComponent } from './form.component';
import { SafeFormModalModule } from '../form-modal/form-modal.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SurveyModule } from 'survey-angular-ui';

/**
 * SafeFormModule is a class used to manage all the modules and components
 * related to the form display.
 */
@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    SafeFormModalModule,
    MatTabsModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
    DateInputModule,
    SurveyModule,
  ],
  exports: [SafeFormComponent],
})
export class SafeFormModule {}
