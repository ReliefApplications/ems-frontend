import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SummaryCardItemModule } from './summary-card-item/summary-card-item.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeGridWidgetModule } from '../grid/grid.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagerModule } from '@progress/kendo-angular-pager';
import { SafeSkeletonModule } from '../../../directives/skeleton/skeleton.module';

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
    MatTooltipModule,
    TranslateModule,
    InputsModule,
    FormsModule,
    ReactiveFormsModule,
    PagerModule,
    SafeSkeletonModule,
  ],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
