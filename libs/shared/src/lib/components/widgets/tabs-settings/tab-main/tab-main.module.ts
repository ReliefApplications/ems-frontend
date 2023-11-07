import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabMainComponent } from './tab-main.component';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  TabsModule,
  TooltipModule,
} from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabSettingsModule } from '../tab-settings/tab-settings.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * Main tab of tabs widget edition module.
 */
@NgModule({
  declarations: [TabMainComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    ButtonModule,
    TabSettingsModule,
    DragDropModule,
    TooltipModule,
  ],
  exports: [TabMainComponent],
})
export class TabMainModule {}
