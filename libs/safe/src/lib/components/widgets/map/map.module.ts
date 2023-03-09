import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapWidgetComponent } from './map.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { MapModule } from '../../ui/map/map.module';

/**
 * Map widget module
 */
@NgModule({
  declarations: [SafeMapWidgetComponent],
  imports: [CommonModule, LayoutModule, MapModule],
  exports: [SafeMapWidgetComponent],
})
export class SafeMapWidgetModule {}
