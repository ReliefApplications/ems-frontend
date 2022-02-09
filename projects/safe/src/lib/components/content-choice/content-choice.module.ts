import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRippleModule } from '@angular/material/core';
import { SafeContentChoiceComponent } from './content-choice.component';

@NgModule({
  declarations: [SafeContentChoiceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatRippleModule,
  ],
  exports: [SafeContentChoiceComponent],
})
export class SafeContentChoiceModule {}
