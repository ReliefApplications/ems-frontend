import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFilterComponent } from './layer-filter.component';

/** Module for the LayerFilterComponent */
@NgModule({
  declarations: [LayerFilterComponent],
  imports: [CommonModule],
  exports: [LayerFilterComponent],
})
export class LayerFilterModule {}
