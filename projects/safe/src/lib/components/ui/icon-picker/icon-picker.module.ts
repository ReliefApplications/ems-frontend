import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeIconPickerComponent } from './icon-picker.component';
import { MatCardModule } from '@angular/material/card';
import { SafeIconDisplayModule } from '../../../pipes/icon-display/icon-display.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

/** Module for icon picker component */
@NgModule({
  declarations: [SafeIconPickerComponent],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    SafeIconDisplayModule,
    TranslateModule,
  ],
  exports: [SafeIconPickerComponent],
})
export class SafeIconPickerModule {}
