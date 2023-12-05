import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapWidgetComponent } from './map.component';
import { MapModule } from '../../ui/map/map.module';

/**
 * Map widget module
 */
@NgModule({
  declarations: [MapWidgetComponent],
  imports: [CommonModule, MapModule],
  exports: [MapWidgetComponent],
})
export class MapWidgetModule {}
