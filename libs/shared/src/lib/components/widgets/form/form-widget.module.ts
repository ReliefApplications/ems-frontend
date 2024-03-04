import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from '../../form/form.module';

/** Module for the form widget component */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
