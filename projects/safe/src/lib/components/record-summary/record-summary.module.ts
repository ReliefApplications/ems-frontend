import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../pipes/date/date.module';

@NgModule({
  declarations: [SafeRecordSummaryComponent],
  imports: [
    CommonModule,
    SafeButtonModule,
    MatTooltipModule,
    TranslateModule,
    SafeDateModule,
  ],
  exports: [SafeRecordSummaryComponent],
})
export class SafeRecordSummaryModule {}
