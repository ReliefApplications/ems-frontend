import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeResourceGridModalComponent } from './search-resource-grid-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SafeResourceDropdownModule } from '../resource-dropdown/resource-dropdown.module';
import { SafeApplicationDropdownModule } from '../application-dropdown/application-dropdown.module';
import { SafeRecordDropdownModule } from '../record-dropdown/record-dropdown.module';
import { SafeCoreGridModule } from '../ui/core-grid/core-grid.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * Resource grid modal component module.
 */
@NgModule({
  declarations: [SafeResourceGridModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    SafeResourceDropdownModule,
    SafeApplicationDropdownModule,
    SafeRecordDropdownModule,
    SafeCoreGridModule,
    SafeButtonModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [SafeResourceGridModalComponent],
})
export class SafeSearchResourceGridModalModule {}
