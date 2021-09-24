import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChooseRecordModalComponent } from './choose-record-modal.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeResourceGridModule } from '../resource-grid/resource-grid.module';

@NgModule({
  declarations: [SafeChooseRecordModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SafeResourceGridModule
  ],
  exports: [SafeChooseRecordModalComponent]
})
export class SafeChooseRecordModalModule { }
