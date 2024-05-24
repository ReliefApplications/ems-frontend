import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapWidgetComponent } from './map.component';
import { MapModule } from '../../ui/map/map.module';
import { IconModule, TooltipModule } from '@oort-front/ui';

/**
 * Map widget module
 */
@NgModule({
  declarations: [MapWidgetComponent],
  imports: [CommonModule, MapModule, TooltipModule, IconModule],
  exports: [MapWidgetComponent],
})
export class MapWidgetModule {}
