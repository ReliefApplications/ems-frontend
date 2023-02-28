import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SummaryCardItemModule } from './summary-card-item/summary-card-item.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SafeButtonModule,
    PDFExportModule,
    SummaryCardItemModule,
    IndicatorsModule,
  ],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
