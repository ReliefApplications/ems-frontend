import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPickerComponent } from './icon-picker.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconDisplayModule } from '../../pipes/icon-display/icon-display.module';

/** Module for icon picker component */
@NgModule({
  declarations: [IconPickerComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    SafeIconDisplayModule,
    TranslateModule,
  ],
  exports: [IconPickerComponent],
})
export class IconPickerModule {}
