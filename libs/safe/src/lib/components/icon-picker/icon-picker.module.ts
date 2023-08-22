import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPickerComponent } from './icon-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconDisplayModule } from '../../pipes/icon-display/icon-display.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerPopupComponent } from './icon-picker-popup/icon-picker-popup.component';
import { ButtonModule, SelectMenuModule, TooltipModule } from '@oort-front/ui';

/** Module for icon picker component */
@NgModule({
  declarations: [IconPickerComponent, IconPickerPopupComponent],
  imports: [
    CommonModule,
    TooltipModule,
    SafeIconDisplayModule,
    TranslateModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectMenuModule,
  ],
  exports: [IconPickerComponent],
})
export class IconPickerModule {}
