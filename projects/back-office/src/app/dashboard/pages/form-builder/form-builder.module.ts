import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { WhoFormBuilderModule } from 'who-shared';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [FormBuilderComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    MatProgressSpinnerModule,
    WhoFormBuilderModule
  ],
  exports: [FormBuilderComponent]
})
export class FormBuilderModule { }
