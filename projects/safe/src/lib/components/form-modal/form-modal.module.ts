import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeFormModalComponent } from './form-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeRecordHistoryModalModule } from '../record-history-modal/record-history-modal.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * SafeFormModalModule is a class used to manage all the modules and components
 * related to modals containing forms.
 */
@NgModule({
  declarations: [SafeFormModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordHistoryModalModule,
    SafeRecordSummaryModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  exports: [SafeFormModalComponent],
})
export class SafeFormModalModule {}
