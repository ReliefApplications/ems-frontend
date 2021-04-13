import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormAnswerRoutingModule } from './form-answer-routing.module';
import { FormAnswerComponent } from './form-answer.component';
import { SafeFormModule } from '@safe/builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [FormAnswerComponent],
  imports: [
    CommonModule,
    FormAnswerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    SafeFormModule
  ],
  exports: [FormAnswerComponent]
})
export class FormAnswerModule { }
