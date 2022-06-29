import { NgModule } from '@angular/core';
import { SafeSummaryCardSettingsComponent } from './summary-card-settings.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SafeCardSettingsModule } from './card-settings/card-settings.module';
import { SafeCardCreationModalModule } from './card-creation-modal/card-creation-modal.module';

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
    MatTooltipModule,
    MatRadioModule,
    SafeIconModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    SafeCardSettingsModule,
    SafeCardCreationModalModule,
  ],
  exports: [SafeSummaryCardSettingsComponent],
})
export class SafeSummaryCardSettingsModule {}
