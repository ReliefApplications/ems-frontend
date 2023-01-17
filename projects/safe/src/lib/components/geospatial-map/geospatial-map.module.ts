import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeospatialMapComponent } from './geospatial-map.component';

/**
 * SafeGeospatialMapModule is a class used to manage all the modules and components
 * related to geospatial map.
 */
@NgModule({
  declarations: [SafeGeospatialMapComponent],
  imports: [CommonModule],
  exports: [SafeGeospatialMapComponent],
})
export class SafeGeospatialMapModule {}
