import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { SafeButtonModule, SafeFormModule } from '@oort-front/safe';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { ButtonModule } from '@oort-front/ui';

/** Form module. */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeFormModule,
    MatProgressSpinnerModule,
    ButtonModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
