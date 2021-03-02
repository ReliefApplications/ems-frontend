import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoRecordModalComponent } from './record-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [WhoRecordModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule
  ],
  exports: [WhoRecordModalComponent]
})
export class WhoRecordModalModule { }
