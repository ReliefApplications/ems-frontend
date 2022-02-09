import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordHistoryModalComponent } from './record-history-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeRecordHistoryModule } from '../record-history/record-history.module';

@NgModule({
  declarations: [RecordHistoryModalComponent],
  imports: [CommonModule, MatDialogModule, SafeRecordHistoryModule],
  exports: [RecordHistoryModalComponent],
})
export class SafeRecordHistoryModalModule {}
