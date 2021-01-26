import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoRecordHistoryComponent } from './record-history.component';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WhoRecordHistoryComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [WhoRecordHistoryComponent]
})
export class WhoRecordHistoryModule { }
