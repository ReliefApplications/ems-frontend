import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeResourceGridModalComponent } from './search-resource-grid-modal.component';
import { SafeGridCoreModule } from '../ui/grid-core/grid-core.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { SafeResourceDropdownModule } from '../resource-dropdown/resource-dropdown.module';
import { SafeApplicationDropdownModule } from '../application-dropdown/application-dropdown.module';

@NgModule({
  declarations: [SafeResourceGridModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SafeGridCoreModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    SafeResourceDropdownModule,
    SafeApplicationDropdownModule
  ],
  exports: [SafeResourceGridModalComponent]
})
export class SafeSearchResourceGridModalModule { }
