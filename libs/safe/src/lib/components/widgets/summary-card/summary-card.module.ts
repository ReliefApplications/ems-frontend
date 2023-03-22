import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SummaryCardItemModule } from './summary-card-item/summary-card-item.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { SafeGridWidgetModule } from '../grid/grid.module';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SafeButtonModule,
    PDFExportModule,
    SummaryCardItemModule,
    SafeGridWidgetModule,
    IndicatorsModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
