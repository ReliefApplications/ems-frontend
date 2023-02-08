import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeospatialMapComponent } from './geospatial-map.component';
import { SafeLayerStylingModule } from './layer-styling/layer-styling.module';
import { SafeGeoFieldsModule } from './geo-fields/geo-fields.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';

/**
 * SafeGeospatialMapModule is a class used to manage all the modules and components
 * related to geospatial map.
 */
@NgModule({
  declarations: [SafeGeospatialMapComponent],
  imports: [
    CommonModule,
    SafeLayerStylingModule,
    MatSnackBarModule,
    SafeGeoFieldsModule,
  ],
  exports: [SafeGeospatialMapComponent],
})
export class SafeGeospatialMapModule {}
