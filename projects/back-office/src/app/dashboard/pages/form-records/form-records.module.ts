import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [FormRecordsComponent],
  imports: [
    CommonModule,
    FormRecordsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [FormRecordsComponent]
})
export class FormRecordsModule { }
