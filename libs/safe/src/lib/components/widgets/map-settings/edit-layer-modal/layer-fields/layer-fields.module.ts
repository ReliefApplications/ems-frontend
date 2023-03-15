import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFieldsComponent } from './layer-fields.component';

/**
 * Map layer fields settings module.
 */
@NgModule({
  declarations: [LayerFieldsComponent],
  imports: [CommonModule],
  exports: [LayerFieldsComponent],
})
export class LayerFieldsModule {}
