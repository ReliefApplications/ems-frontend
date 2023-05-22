import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabButtonsComponent } from './tab-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { TabsModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonConfigModule } from '../button-config/button-config.module';
import { SafeAlertModule } from '../../../ui/alert/alert.module';
import { IconModule } from '@oort-front/ui';

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
    IconModule,
    TabsModule,
    DragDropModule,
    ButtonConfigModule,
    SafeAlertModule,
  ],
  exports: [TabButtonsComponent],
})
export class TabButtonsModule {}
