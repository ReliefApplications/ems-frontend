import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSettingsComponent } from './tab-settings.component';
import { WidgetGridModule } from '../../../widget-grid/widget-grid.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule, FormWrapperModule, ToggleModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

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
  ],
  exports: [TabSettingsComponent],
})
export class TabSettingsModule {}
