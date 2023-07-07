import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerStylingComponent } from './layer-styling.component';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DividerModule, FormWrapperModule } from '@oort-front/ui';

/** Module for the LayerStylingComponent */
@NgModule({
  declarations: [LayerStylingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormWrapperModule,
    DividerModule,
    TranslateModule,
  ],
  exports: [LayerStylingComponent],
})
export class LayerStylingModule {}
