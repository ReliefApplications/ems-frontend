import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWidgetComponent } from './form-widget.component';
import { FormModule } from '../../components/form/form.module';

@NgModule({
  declarations: [FormWidgetComponent],
  imports: [CommonModule, FormModule],
  exports: [FormWidgetComponent],
})
export class FormWidgetModule {}
