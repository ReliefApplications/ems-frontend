import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeChooseRecordModalComponent } from './choose-record-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeResourceDropdownModule } from '../resource-dropdown/resource-dropdown.module';
import { SafeApplicationDropdownModule } from '../application-dropdown/application-dropdown.module';
import { SafeRecordDropdownModule } from '../record-dropdown/record-dropdown.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * SafeChooseRecordModalModule is a class used to manage all the modules and components
 * related to the modals displaying the choice of records.
 */
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
    SafeResourceDropdownModule,
    SafeApplicationDropdownModule,
    SafeRecordDropdownModule,
    SafeCoreGridModule,
    TranslateModule,
  ],
  exports: [SafeChooseRecordModalComponent],
})
export class SafeChooseRecordModalModule {}
