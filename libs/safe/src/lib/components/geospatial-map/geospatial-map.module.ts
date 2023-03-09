import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeospatialMapComponent } from './geospatial-map.component';
import { LayerStylingModule } from './layer-styling/layer-styling.module';
import { MapModule } from '../ui/map/map.module';

/**
 * GeospatialMapModule is a class used to manage all the modules and components
 * related to geospatial map.
 */
@NgModule({
  declarations: [GeospatialMapComponent],
  imports: [CommonModule, LayerStylingModule, MapModule],
  exports: [GeospatialMapComponent],
})
export class GeospatialMapModule {}
