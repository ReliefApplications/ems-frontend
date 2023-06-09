import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SliderModule,
  FormWrapperModule,
  SelectMenuModule,
  IconModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule, ErrorMessageModule } from '@oort-front/ui';
import { SafeMapModule } from '../../map/map.module';

/**
 * Module of Map Properties of Map Widget.
 */
@NgModule({
  declarations: [MapPropertiesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    SliderModule,
    TooltipModule,
    IconModule,
    SafeMapModule,
    SelectMenuModule,
    ErrorMessageModule,
  ],
  exports: [MapPropertiesComponent],
})
export class MapPropertiesModule {}
