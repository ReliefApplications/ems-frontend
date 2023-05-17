import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryCardItemComponent } from './summary-card-item.component';
import { SummaryCardItemContentModule } from '../summary-card-item-content/summary-card-item-content.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonModule } from '@oort-front/ui';

/**
 * Single item of summary card.
 */
@NgModule({
  declarations: [SummaryCardItemComponent],
  imports: [
    CommonModule,
    SummaryCardItemContentModule,
    SafeButtonModule,
    TranslateModule,
    IndicatorsModule,
    ButtonModule,
  ],
  exports: [SummaryCardItemComponent],
})
export class SummaryCardItemModule {}
