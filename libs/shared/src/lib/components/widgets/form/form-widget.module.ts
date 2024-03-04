import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from '../../form/form.module';
import { ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/** Module for the form widget component */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule, ButtonModule, TranslateModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
