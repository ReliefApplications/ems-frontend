import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordModalComponent } from './record-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeRecordHistoryModalModule } from '../record-history-modal/record-history-modal.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafeRecordModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatTabsModule,
    MatGridListModule,
    MatIconModule,
    MatButtonModule,
    SafeButtonModule,
    SafeRecordHistoryModalModule,
    SafeRecordSummaryModule,
    TranslateModule,
  ],
  exports: [SafeRecordModalComponent],
})
export class SafeRecordModalModule {}
