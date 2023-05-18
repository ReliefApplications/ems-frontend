import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabButtonsComponent } from './tab-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonConfigModule } from '../button-config/button-config.module';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { ButtonModule } from '@oort-front/ui';

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
    SafeIconModule,
    MatTabsModule,
    DragDropModule,
    ButtonConfigModule,
    SafeAlertModule,
    ButtonModule,
  ],
  exports: [TabButtonsComponent],
})
export class TabButtonsModule {}
