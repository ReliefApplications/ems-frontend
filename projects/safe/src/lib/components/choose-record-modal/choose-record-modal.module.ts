import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChooseRecordModalComponent } from './choose-record-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeResourceGridModule } from '../resource-grid/resource-grid.module';
import { SafeResourceDropdownModule } from '../resource-dropdown/resource-dropdown.module';
import { SafeApplicationDropdownModule } from '../application-dropdown/application-dropdown.module';

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
    SafeResourceGridModule,
    SafeResourceDropdownModule,
    SafeApplicationDropdownModule
  ],
  exports: [SafeChooseRecordModalComponent]
})
export class SafeChooseRecordModalModule { }
