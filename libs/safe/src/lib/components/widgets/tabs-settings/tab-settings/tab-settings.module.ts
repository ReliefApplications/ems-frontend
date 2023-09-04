import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSettingsComponent } from './tab-settings.component';
import { SafeWidgetGridModule } from '../../../widget-grid/widget-grid.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormWrapperModule } from '@oort-front/ui';

@NgModule({
  declarations: [TabSettingsComponent],
  imports: [
    CommonModule,
    SafeWidgetGridModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
  ],
  exports: [TabSettingsComponent],
})
export class TabSettingsModule {}
