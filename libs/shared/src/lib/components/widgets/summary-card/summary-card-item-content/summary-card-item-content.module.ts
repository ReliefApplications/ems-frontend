import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardItemContentComponent } from './summary-card-item-content.component';
import { HtmlWidgetContentModule } from '../../common/html-widget-content/html-widget-content.module';

/**
 * Content of Single Item of Summary Card.
 */
@NgModule({
  declarations: [SummaryCardItemContentComponent],
  imports: [CommonModule, HtmlWidgetContentModule],
  exports: [SummaryCardItemContentComponent],
})
export class SummaryCardItemContentModule {}
