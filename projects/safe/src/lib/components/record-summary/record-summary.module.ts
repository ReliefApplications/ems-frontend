import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeRecordSummaryComponent } from './record-summary.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    SafeRecordSummaryComponent
  ],
  imports: [
    CommonModule,
    SafeButtonModule,
    MatTooltipModule
  ],
  exports: [
    SafeRecordSummaryComponent
  ]
})
export class SafeRecordSummaryModule { }
