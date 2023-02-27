import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MapGeneralModule } from './map-general/map-general.module';
import { MapLayersModule } from './map-layers/map-layers.module';
import { MapPropertiesModule } from './map-properties/map-properties.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

/** Module for map settings component */
@NgModule({
  declarations: [SafeMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeIconModule,
    TranslateModule,
    MatTabsModule,
    MapGeneralModule,
    MapLayersModule,
    MapPropertiesModule,
    MatTooltipModule,
  ],
  exports: [SafeMapSettingsComponent],
})
export class SafeMapSettingsModule {}
