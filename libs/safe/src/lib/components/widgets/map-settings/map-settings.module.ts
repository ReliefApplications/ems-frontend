import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapSettingsComponent } from './map-settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MapLayersModule } from './map-layers/map-layers.module';
import { MapPropertiesModule } from './map-properties/map-properties.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MapModule } from '../../ui/map/map.module';
import { MapLayerModule } from './map-layer/map-layer.module';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  SidenavContainerModule,
  TabsModule,
} from '@oort-front/ui';
import { TooltipModule } from '@oort-front/ui';
import { DisplaySettingsComponent } from '../common/display-settings/display-settings.component';

/** Module for map settings component */
@NgModule({
  declarations: [SafeMapSettingsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TranslateModule,
    TabsModule,
    MapLayersModule,
    MapPropertiesModule,
    TooltipModule,
    MatSidenavModule,
    MapModule,
    ButtonModule,
    DividerModule,
    MapLayerModule,
    TabsModule,
    SidenavContainerModule,
    MapLayersModule,
    MapPropertiesModule,
    TooltipModule,
    DisplaySettingsComponent,
  ],
  exports: [SafeMapSettingsComponent],
})
export class SafeMapSettingsModule {}
