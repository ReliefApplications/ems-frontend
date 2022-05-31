import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DateInputModule } from '@progress/kendo-angular-dateinputs';

@NgModule({
  declarations: [SafeRecordSummaryComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    DateInputModule,
  ],
  exports: [SafeRecordSummaryComponent],
})
export class SafeRecordSummaryModule {}
