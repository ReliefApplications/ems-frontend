import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordSummaryComponent } from './record-summary.component';
import { TooltipModule, ButtonModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DateModule } from '../../pipes/date/date.module';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

/**
 * RecordSummaryModule is the module related to the records information summary.
 */
@NgModule({
  declarations: [RecordSummaryComponent],
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    DateModule,
    DateInputModule,
    ButtonModule,
  ],
  exports: [RecordSummaryComponent],
})
export class RecordSummaryModule {}
