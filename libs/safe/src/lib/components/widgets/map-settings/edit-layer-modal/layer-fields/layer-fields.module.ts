import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFieldsComponent } from './layer-fields.component';
import { SafeEditableTextModule } from '../../../../editable-text/editable-text.module';
import { IconModule } from '@oort-front/ui';

/**
 * Map layer fields settings module.
 */
@NgModule({
  declarations: [LayerFieldsComponent],
  imports: [CommonModule, IconModule, SafeEditableTextModule],
  exports: [LayerFieldsComponent],
})
export class LayerFieldsModule {}
