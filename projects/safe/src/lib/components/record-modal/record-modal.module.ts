import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordModalComponent } from './record-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [SafeRecordModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [SafeRecordModalComponent]
})
export class SafeRecordModalModule { }
