import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLegendComponent } from './map-legend.component';
import { SafeIconModule } from '../../../ui/icon/icon.module';

/** Module for the map legend component */
@NgModule({
  declarations: [MapLegendComponent],
  imports: [CommonModule, SafeIconModule],
  exports: [MapLegendComponent],
})
export class MapLegendModule {}
