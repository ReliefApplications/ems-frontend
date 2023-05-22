import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAnswerRoutingModule } from './form-answer-routing.module';
import { FormAnswerComponent } from './form-answer.component';
import { SafeFormModule } from '@oort-front/safe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

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
    MatFormFieldModule,
    MatSelectModule,
    SafeFormModule,
    TranslateModule,
    ButtonModule,
  ],
  exports: [FormAnswerComponent],
})
export class FormAnswerModule {}
