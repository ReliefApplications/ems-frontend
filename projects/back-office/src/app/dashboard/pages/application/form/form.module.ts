import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';


@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule
  ]
})
export class FormModule { }
