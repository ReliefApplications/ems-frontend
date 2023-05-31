import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { IconModule } from '@oort-front/ui';
import { SafeAddCardModule } from './add-card/add-card.module';
import { SummaryCardItemModule } from '../summary-card/summary-card-item/summary-card-item.module';
import {
  MenuModule,
  TooltipModule,
  RadioModule,
  ButtonModule,
  FormWrapperModule,
  DividerModule,
} from '@oort-front/ui';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    LayoutModule,
    TooltipModule,
    MenuModule,
    IconModule,
    DividerModule,
    SafeAddCardModule,
    SummaryCardItemModule,
    RadioModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
