import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardItemContentComponent } from './summary-card-item-content.component';

/**
 * Content of Single Item of Summary Card.
 */
@NgModule({
  declarations: [SummaryCardItemContentComponent],
  imports: [CommonModule],
  exports: [SummaryCardItemContentComponent],
})
export class SummaryCardItemContentModule {}
