import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SkeletonDirective } from './skeleton.directive';

/**
 * Skeleton module.
 */
@NgModule({
  declarations: [SkeletonDirective],
  imports: [CommonModule, IndicatorsModule],
  exports: [SkeletonDirective],
})
export class SkeletonModule {}
