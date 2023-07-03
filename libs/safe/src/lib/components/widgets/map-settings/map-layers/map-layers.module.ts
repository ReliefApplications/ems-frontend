import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayersComponent } from './map-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MapMarkersModule } from './map-markers/map-markers.module';
import { MapClorophletsModule } from './map-clorophlets/map-clorophlets.module';
import { MapOnlineLayersModule } from './map-online-layers/map-online-layers.module';

/**
 * Map Widget layers configuration module.
 */
@NgModule({
  declarations: [MapLayersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TabsModule,
    MapMarkersModule,
    MapClorophletsModule,
    MapOnlineLayersModule,
  ],
  exports: [MapLayersComponent],
})
export class MapLayersModule {}
