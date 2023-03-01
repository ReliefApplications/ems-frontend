import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../pipes/date/date.module';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

/**
 * SafeRecordSummaryModule is the module related to the records information summary.
 */
@NgModule({
  declarations: [SafeRecordSummaryComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeDateModule,
    DateInputModule,
  ],
  exports: [SafeRecordSummaryComponent],
})
export class SafeRecordSummaryModule {}
