import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeResourceGridModalComponent } from './search-resource-grid-modal.component';
import { SafeResourceGridModule } from '../resource-grid/resource-grid.module';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SafeResourceGridModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    SafeResourceGridModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  exports: [SafeResourceGridModalComponent]
})
export class SafeSearchResourceGridModalModule { }
