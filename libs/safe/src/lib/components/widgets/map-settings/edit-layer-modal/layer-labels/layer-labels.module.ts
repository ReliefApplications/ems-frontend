import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerLabelsComponent } from './layer-labels.component';

/** Module for the LayerLabelsComponent */
@NgModule({
  declarations: [LayerLabelsComponent],
  imports: [CommonModule],
  exports: [LayerLabelsComponent],
})
export class LayerLabelsModule {}
