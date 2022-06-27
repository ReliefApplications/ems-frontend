import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { SafeFormModule, SafeButtonModule } from '@safe/builder';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Application preview form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    SafeFormModule,
    SafeButtonModule,
    TranslateModule,
  ],
  exports: [FormComponent],
})
export class FormModule {}
