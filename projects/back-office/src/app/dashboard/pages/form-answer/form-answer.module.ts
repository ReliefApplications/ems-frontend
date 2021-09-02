import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormAnswerRoutingModule } from './form-answer-routing.module';
import { FormAnswerComponent } from './form-answer.component';
import { SafeFormModule } from '@safe/builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import {SafeButtonModule} from '../../../../../../safe/src/lib/components/ui/button/button.module';


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
    SafeFormModule,
    SafeButtonModule
  ],
  exports: [FormAnswerComponent]
})
export class FormAnswerModule { }
