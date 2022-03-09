import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SafeButtonModule, SafeFormModule } from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeFormModule,
    MatProgressSpinnerModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
