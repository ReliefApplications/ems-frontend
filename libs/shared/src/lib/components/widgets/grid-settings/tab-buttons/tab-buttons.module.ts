import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabButtonsComponent } from './tab-buttons.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AlertModule,
  IconModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ButtonConfigModule } from '../button-config/button-config.module';
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
    IconModule,
    TabsModule,
    DragDropModule,
    ButtonConfigModule,
    ButtonModule,
    AlertModule,
    TooltipModule,
  ],
  exports: [TabButtonsComponent],
})
export class TabButtonsModule {}
