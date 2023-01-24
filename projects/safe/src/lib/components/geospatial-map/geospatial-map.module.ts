import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeospatialMapComponent } from './geospatial-map.component';
import { SafeLayerStylingComponent } from './layer-styling/layer-styling.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * SafeGeospatialMapModule is a class used to manage all the modules and components
 * related to geospatial map.
 */
@NgModule({
  declarations: [SafeGeospatialMapComponent, SafeLayerStylingComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    SafeDividerModule,
    TranslateModule,
  ],
  exports: [SafeGeospatialMapComponent],
})
export class SafeGeospatialMapModule {}
