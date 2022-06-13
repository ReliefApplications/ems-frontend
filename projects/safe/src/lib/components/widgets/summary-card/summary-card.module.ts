import { LayoutModule } from '@progress/kendo-angular-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSummaryCardComponent } from './summary-card.component';

/** Module for scheduler  component */
@NgModule({
  declarations: [SafeSummaryCardComponent],
  imports: [CommonModule, LayoutModule],
  exports: [SafeSummaryCardComponent],
})
export class SafeSummaryCardModule {}
