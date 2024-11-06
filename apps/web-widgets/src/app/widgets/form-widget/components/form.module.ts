import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormModule as SharedFormModule } from '@oort-front/shared';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';
import { FormComponent } from './form.component';

/** Form module. */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SharedFormModule,
    ButtonModule,
    SpinnerModule,
    TranslateModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
