import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardItemContentComponent } from './summary-card-item-content.component';
import { SafeIsolatedHtmlModule } from '../../isolated-html/isolated-html.module';

/**
 * Content of Single Item of Summary Card.
 */
@NgModule({
  declarations: [SummaryCardItemContentComponent],
  imports: [CommonModule, SafeIsolatedHtmlModule],
  exports: [SummaryCardItemContentComponent],
})
export class SummaryCardItemContentModule {}
