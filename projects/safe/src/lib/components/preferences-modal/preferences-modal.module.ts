import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePreferencesModalComponent } from './preferences-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeRecordHistoryModalModule } from '../record-history-modal/record-history-modal.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SafePreferencesModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordHistoryModalModule,
    SafeRecordSummaryModule,
    TranslateModule,
  ],
  exports: [SafePreferencesModalComponent],
})
export class SafePreferencesModalModule {}
