import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRecordsRoutingModule } from './form-records-routing.module';
import { FormRecordsComponent } from './form-records.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { SafeRecordHistoryModule, SafeButtonModule } from '@safe/builder';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [FormRecordsComponent],
  imports: [
    CommonModule,
    FormRecordsRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeRecordHistoryModule,
    MatDividerModule,
    MatTooltipModule,
    SafeButtonModule
  ],
  exports: [FormRecordsComponent]
})
export class FormRecordsModule { }
