import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPickerComponent } from './icon-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconPickerPopupComponent } from './icon-picker-popup/icon-picker-popup.component';
import { ButtonModule, SelectMenuModule, TooltipModule } from '@oort-front/ui';
import { SanitizeHtmlPipe } from '../../../pipes/sanitize-html/sanitize-html.pipe';

/** Module for icon picker component */
@NgModule({
  declarations: [IconPickerComponent, IconPickerPopupComponent],
  imports: [
    CommonModule,
    TooltipModule,
    TranslateModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectMenuModule,
    SanitizeHtmlPipe,
  ],
  exports: [IconPickerComponent],
})
export class IconPickerModule {}
