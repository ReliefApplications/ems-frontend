import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFilterComponent } from './layer-filter.component';

/**
 * Map layer filter settings module.
 */
@NgModule({
  declarations: [LayerFilterComponent],
  imports: [CommonModule],
  exports: [LayerFilterComponent],
})
export class LayerFilterModule {}
