import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { MatButtonModule } from '@angular/material/button';
import { WhoFormModule } from '@who-ems/builder';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    MatButtonModule,
    WhoFormModule
  ],
  exports: [FormComponent]
})
export class FormModule { }
