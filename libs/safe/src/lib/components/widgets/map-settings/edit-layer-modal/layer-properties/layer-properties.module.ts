import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPropertiesComponent } from './layer-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeFilterModule } from '../../../../filter/filter.module';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  SliderModule,
  ToggleModule,
} from '@oort-front/ui';

/**
 * Map layer properties module.
 */
@NgModule({
  declarations: [LayerPropertiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SliderModule,
    ToggleModule,
    DialogModule,
    FormWrapperModule,
    SafeFilterModule,
    ButtonModule,
  ],
  exports: [LayerPropertiesComponent],
})
export class LayerPropertiesModule {}
