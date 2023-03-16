import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerPopupComponent } from './layer-popup.component';

/**
 * Map layer properties popup module.
 */
@NgModule({
  declarations: [LayerPopupComponent],
  imports: [CommonModule],
  exports: [LayerPopupComponent],
})
export class LayerPopupModule {}
