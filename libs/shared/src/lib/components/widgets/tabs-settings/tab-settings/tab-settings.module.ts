import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSettingsComponent } from './tab-settings.component';
import { WidgetGridModule } from '../../../widget-grid/widget-grid.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  FormWrapperModule,
  IconModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { IconPickerModule } from '../../../controls/icon-picker/icon-picker.module';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizedInputComponent } from '../../../controls/public-api';

/**
 * Tab settings module, part of tabs widget settings.
 */
@NgModule({
  declarations: [TabSettingsComponent],
  imports: [
    CommonModule,
    WidgetGridModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ButtonModule,
    TranslateModule,
    ToggleModule,
    IconPickerModule,
    IconModule,
    TooltipModule,
    LocalizedInputComponent,
  ],
  exports: [TabSettingsComponent],
})
export class TabSettingsModule {}
