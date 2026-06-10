import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapWidgetComponent } from './map.component';
import { MapModule } from '../../ui/map/map.module';
import { LocalizePipe } from '../../../pipes/localize/localize.pipe';

/**
 * Map widget module
 */
@NgModule({
  declarations: [MapWidgetComponent],
  imports: [
    CommonModule,
    MapModule,
    LocalizePipe,
  ],
  exports: [MapWidgetComponent],
})
export class MapWidgetModule {}
