import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeButtonModule } from '../../ui/button/button.module';
import { TooltipModule } from '@oort-front/ui';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MenuModule } from '@oort-front/ui';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SafeAddCardModule } from './add-card/add-card.module';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SummaryCardItemModule } from '../summary-card/summary-card-item/summary-card-item.module';
import { RadioModule, ButtonModule } from '@oort-front/ui';

/** Summary Card Settings Module */
@NgModule({
  declarations: [SafeSummaryCardSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    LayoutModule,
    SafeButtonModule,
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
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
