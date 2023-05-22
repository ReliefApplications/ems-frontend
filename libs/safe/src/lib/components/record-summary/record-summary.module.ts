import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { TooltipModule, ButtonModule } from '@oort-front/ui';
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
    TooltipModule,
    TranslateModule,
    SafeDateModule,
    DateInputModule,
    ButtonModule,
  ],
  exports: [SafeRecordSummaryComponent],
})
export class SafeRecordSummaryModule {}
