import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeSkeletonDirective } from './skeleton.directive';

/**
 *
 */
@NgModule({
  declarations: [SafeSkeletonDirective],
  imports: [CommonModule, IndicatorsModule],
  exports: [SafeSkeletonDirective],
})
export class SafeSkeletonModule {}
