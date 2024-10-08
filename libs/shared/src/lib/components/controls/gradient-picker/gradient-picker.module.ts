import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GradientPickerComponent } from './gradient-picker.component';
import { GradientPickerPopupComponent } from './gradient-picker-popup/gradient-picker-popup.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { GradientPipe } from '../../../pipes/gradient/gradient.pipe';
import { ButtonModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Gradient picker module.
 */
@NgModule({
  declarations: [GradientPickerComponent, GradientPickerPopupComponent],
  imports: [
    CommonModule,
    OverlayModule,
    GradientPipe,
    ButtonModule,
    TooltipModule,
    TranslateModule,
  ],
  exports: [GradientPickerComponent],
})
export class GradientPickerModule {}
