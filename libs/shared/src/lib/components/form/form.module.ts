import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FixedWrapperModule, IconModule, TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormComponent } from './form.component';
import { FormActionsModule } from '../form-actions/form-actions.module';
import { RecordSummaryModule } from '../record-summary/record-summary.module';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { SurveyModule } from 'survey-angular-ui';

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
    TooltipModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
