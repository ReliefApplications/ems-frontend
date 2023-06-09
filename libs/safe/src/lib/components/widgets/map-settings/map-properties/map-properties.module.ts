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
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MapControlsModule } from './map-controls/map-controls.module';
import { WebmapSelectComponent } from './webmap-select/webmap-select.component';
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
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatTooltipModule,
    MatSelectModule,
    SafeIconModule,
    SafeButtonModule,
    SafeDividerModule,
    MatCheckboxModule,
    MapControlsModule,
    WebmapSelectComponent,
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
