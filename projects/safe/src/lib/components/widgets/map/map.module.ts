import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeMapWidgetComponent } from './map.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { SafeMapModule } from '../../ui/map/map.module';

/**
 * Map modules
 */
@NgModule({
  declarations: [SafeMapWidgetComponent],
  imports: [CommonModule, LayoutModule, SafeMapModule],
  exports: [SafeMapWidgetComponent],
})
export class SafeMapWidgetModule {}
