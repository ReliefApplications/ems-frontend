import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAnswerRoutingModule } from './form-answer-routing.module';
import { FormAnswerComponent } from './form-answer.component';
import { SafeFormModule, SafeButtonModule } from '@oort-front/safe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { TranslateModule } from '@ngx-translate/core';

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
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [FormAnswerComponent],
})
export class FormAnswerModule {}
