import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderComponent } from './form-builder.component';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';
import { DialogModule } from '@oort-front/ui';
import { SurveyCreatorModule } from 'survey-creator-angular';
import 'survey-core/survey.i18n.min.js';
// import 'survey-creator-core/survey-creator-core.i18n.min.js';

/**
 * FormBuilderModule is a class used to manage all the modules and components
 * related to the form builder.
 */
@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    DateInputModule,
    SurveyCreatorModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
