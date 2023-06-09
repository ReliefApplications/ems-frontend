import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapPropertiesComponent } from './map-properties.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  SliderModule,
  FormWrapperModule,
  SelectMenuModule,
  IconModule,
  ButtonModule,
  DividerModule,
  CheckboxModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MapControlsModule } from './map-controls/map-controls.module';
import { WebmapSelectComponent } from './webmap-select/webmap-select.component';
import { TooltipModule, ErrorMessageModule } from '@oort-front/ui';
// import { SafeMapModule } from '../../map/map.module';

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
    TooltipModule,
    SelectMenuModule,
    IconModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    MapControlsModule,
    WebmapSelectComponent,
    FormWrapperModule,
    SliderModule,
    TooltipModule,
    IconModule,
    // SafeMapModule,
    SelectMenuModule,
    ErrorMessageModule,
  ],
  exports: [MapPropertiesComponent],
})
export class MapPropertiesModule {}
