import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardItemContentComponent } from './summary-card-item-content.component';
import { SafeHtmlWidgetContentModule } from '../../html-widget-content/html-widget-content.module';

/**
 * Content of Single Item of Summary Card.
 */
@NgModule({
  declarations: [SummaryCardItemContentComponent],
  imports: [CommonModule, SafeHtmlWidgetContentModule],
  exports: [SummaryCardItemContentComponent],
})
export class SummaryCardItemContentModule {}
