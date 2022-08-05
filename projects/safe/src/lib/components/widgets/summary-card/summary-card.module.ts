import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [CommonModule, LayoutModule, SafeButtonModule, PDFExportModule],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
