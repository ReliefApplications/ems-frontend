import { LayoutModule } from '@progress/kendo-angular-layout';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatButtonModule } from '@angular/material/button';

/** Summary Card Widget Module */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    SafeButtonModule,
    PDFExportModule,
    SafeIconModule,
    MatButtonModule,
  ],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
