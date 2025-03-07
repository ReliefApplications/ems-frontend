import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FixedWrapperModule,
  IconModule,
  SpinnerModule,
  TabsModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormComponent } from './form.component';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { ButtonModule } from '@oort-front/ui';
import { SurveyModule } from 'survey-angular-ui';
import { DraftRecordComponent } from '../draft-record/draft-record.component';
import { FormPagesLayoutComponent } from '../form-pages-layout/form-pages-layout.component';
import { DateModule } from '../../pipes/date/date.module';

/**
 * FormModule is a class used to manage all the modules and components
 * related to the form display.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    TabsModule,
    IconModule,
    RecordSummaryModule,
    FormActionsModule,
    TranslateModule,
    ButtonModule,
    SurveyModule,
    SurveyModule,
    FixedWrapperModule,
    DraftRecordComponent,
    SpinnerModule,
    FormPagesLayoutComponent,
    DateModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
