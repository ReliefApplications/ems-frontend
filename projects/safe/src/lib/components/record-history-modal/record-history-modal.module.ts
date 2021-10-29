import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordHistoryModalComponent } from './record-history-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../ui/button/button.module';
import {SafeRecordHistoryModule} from '../record-history/record-history.module';

@NgModule({
  declarations: [RecordHistoryModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    SafeButtonModule,
    SafeRecordHistoryModule
  ],
  exports: [RecordHistoryModalComponent]
})
export class SafeHistoryModalModule { }
