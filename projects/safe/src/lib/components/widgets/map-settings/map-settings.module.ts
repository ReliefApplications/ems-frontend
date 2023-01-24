import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MapGeneralModule } from './map-general/map-general.module';
import { MapLayersModule } from './map-layers/map-layers.module';
import { MapPropertiesModule } from './map-properties/map-properties.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeTabSettingsOptionsModule } from '../../ui/tab-settings-options/tab-settings-options.module';

/** Module for map settings component */
@NgModule({
  declarations: [SafeMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeIconModule,
    TranslateModule,
    SafeTabSettingsOptionsModule,
    MapGeneralModule,
    MapLayersModule,
    MapPropertiesModule,
    MatTooltipModule,
  ],
  exports: [SafeMapSettingsComponent],
})
export class SafeMapSettingsModule {}
