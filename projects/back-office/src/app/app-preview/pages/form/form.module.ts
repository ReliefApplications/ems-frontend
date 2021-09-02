import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { MatButtonModule } from '@angular/material/button';
import { SafeFormModule } from '@safe/builder';
import {SafeButtonModule} from '../../../../../../safe/src/lib/components/ui/button/button.module';

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    FormRoutingModule,
    MatButtonModule,
    SafeFormModule,
    SafeButtonModule
  ],
  exports: [FormComponent]
})
export class FormModule { }
