import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordHistoryModalComponent } from './record-history-modal.component';
import { SafeRecordHistoryModule } from '../record-history/record-history.module';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * SafeRecordHistoryModalModule is a class used to manage all the modules and components
 * related to the history of the records.
 */
@NgModule({
  declarations: [RecordHistoryModalComponent],
  imports: [CommonModule, SafeRecordHistoryModule, SafeModalModule],
  exports: [RecordHistoryModalComponent],
})
export class SafeRecordHistoryModalModule {}
