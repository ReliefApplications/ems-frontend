import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SafeRecordHistoryModule } from '@safe/builder';
import { MatDialog } from '@angular/material/dialog';

@NgModule({
  declarations: [FormRecordsComponent],
  imports: [
    CommonModule,
    FormRecordsRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    SafeRecordHistoryModule
  ],
  exports: [FormRecordsComponent]
})
export class FormRecordsModule { }
