import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeospatialMapComponent } from './geospatial-map.component';
import { SafeLayerStylingComponent } from './layer-styling/layer-styling.component';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * SafeGeospatialMapModule is a class used to manage all the modules and components
 * related to geospatial map.
 */
@NgModule({
  declarations: [SafeGeospatialMapComponent, SafeLayerStylingComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SafeGeospatialMapComponent],
})
export class SafeGeospatialMapModule {}
