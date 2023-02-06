import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabButtonsComponent } from './tab-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { ButtonConfigModule } from '../button-config/button-config.module';
import { SafeAlertModule } from '../../../ui/alert/alert.module';

/**
 * Buttons tab of grid widget configuration modal.
 */
@NgModule({
  declarations: [TabButtonsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    SafeIconModule,
    MatTabsModule,
    ButtonConfigModule,
    SafeAlertModule,
  ],
  exports: [TabButtonsComponent],
})
export class TabButtonsModule {}
