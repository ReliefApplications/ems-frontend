import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoRecordModalComponent } from './record-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WhoRecordModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [WhoRecordModalComponent]
})
export class WhoRecordModalModule { }
