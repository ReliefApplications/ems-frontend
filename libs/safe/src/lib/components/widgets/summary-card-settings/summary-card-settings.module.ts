import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardModule } from './add-card/add-card.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SummaryCardItemModule } from '../summary-card/summary-card-item/summary-card-item.module';
import {
  MenuModule,
  TooltipModule,
  RadioModule,
  ButtonModule,
  FormWrapperModule,
} from '@oort-front/ui';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    LayoutModule,
    TooltipModule,
    SafeIconModule,
    MenuModule,
    MatIconModule,
    MatDividerModule,
    SafeAddCardModule,
    MatButtonModule,
    SummaryCardItemModule,
    RadioModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
