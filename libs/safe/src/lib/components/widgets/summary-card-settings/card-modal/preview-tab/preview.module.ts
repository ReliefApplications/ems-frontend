import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SummaryCardItemContentModule } from '../../../summary-card/summary-card-item-content/summary-card-item-content.module';
import { SafePreviewTabComponent } from './preview-tab.component';

/** Preview tab module for summary card edition */
@NgModule({
  declarations: [SafePreviewTabComponent],
  imports: [CommonModule, TranslateModule, SummaryCardItemContentModule],
  exports: [SafePreviewTabComponent],
})
export class SafePreviewTabModule {}
