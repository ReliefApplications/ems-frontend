import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';

/** Module for the form widget component */
@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
