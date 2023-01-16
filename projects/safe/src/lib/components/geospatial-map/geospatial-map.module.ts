import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGeospatialMapComponent } from './geospatial-map.component';

/**
 * SafeApplicationDropdownModule is a class used to manage all the modules and components
 * related to the dropdown forms where you can select applications.
 */
@NgModule({
  declarations: [SafeGeospatialMapComponent],
  imports: [CommonModule],
  exports: [SafeGeospatialMapComponent],
})
export class SafeApplicationDropdownModule {}
