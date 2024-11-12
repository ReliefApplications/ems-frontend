import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ActionButtonsComponent, FormModule } from '@oort-front/shared';
import { ButtonModule } from '@oort-front/ui';
import { FormAnswerRoutingModule } from './form-answer-routing.module';
import { FormAnswerComponent } from './form-answer.component';

/**
 * Form answer page module.
 */
@NgModule({
  declarations: [FormAnswerComponent],
  imports: [
    CommonModule,
    FormAnswerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormModule,
    TranslateModule,
    ButtonModule,
    ActionButtonsComponent,
  ],
  exports: [FormAnswerComponent],
})
export class FormAnswerModule {}
