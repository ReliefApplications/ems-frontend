import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSkeletonWidgetComponent } from './skeleton-widget.component';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

@NgModule({
  declarations: [SafeSkeletonWidgetComponent],
  imports: [CommonModule, IndicatorsModule],
  exports: [SafeSkeletonWidgetComponent],
})
export class SafeSkeletonWidgetModule {}
