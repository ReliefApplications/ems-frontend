import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardComponent } from './add-card.component';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MatRippleModule } from '@angular/material/core';
import { SafeCardTemplateComponent } from './card-template/card-template.component';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { SafeSkeletonModule } from '../../../../directives/skeleton/skeleton.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeAlertModule } from '../../../ui/alert/alert.module';

/** Module to add new card in summary card widget */
@NgModule({
  declarations: [SafeAddCardComponent, SafeCardTemplateComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule,
    MatRadioModule,
    MatDividerModule,
    SafeModalModule,
    MatRippleModule,
    SafeIconModule,
    SafeSkeletonModule,
    IndicatorsModule,
    SafeAlertModule,
  ],
  exports: [SafeAddCardComponent, SafeCardTemplateComponent],
})
export class SafeAddCardModule {}
