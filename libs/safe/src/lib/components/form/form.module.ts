import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFormComponent } from './form.component';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';

/**
 * SafeFormModule is a class used to manage all the modules and components
 * related to the form display.
 */
@NgModule({
  declarations: [SafeFormComponent],
  imports: [
    CommonModule,
    MatTabsModule,
    SafeButtonModule,
    SafeIconModule,
    SafeRecordSummaryModule,
    SafeFormActionsModule,
    TranslateModule,
  ],
  exports: [SafeFormComponent],
})
export class SafeFormModule {}
