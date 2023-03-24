import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPickerComponent } from './icon-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeIconDisplayModule } from '../../pipes/icon-display/icon-display.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { IconPickerPopupComponent } from './icon-picker-popup/icon-picker-popup.component';

/** Module for icon picker component */
@NgModule({
  declarations: [IconPickerComponent, IconPickerPopupComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    SafeIconDisplayModule,
    TranslateModule,
    OverlayModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SafeButtonModule,
    MatInputModule,
  ],
  exports: [IconPickerComponent],
})
export class IconPickerModule {}
