import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerLabelsComponent } from './layer-labels.component';

/**
 * Map layer labels settings module.
 */
@NgModule({
  declarations: [LayerLabelsComponent],
  imports: [CommonModule],
  exports: [LayerLabelsComponent],
})
export class LayerLabelsModule {}
