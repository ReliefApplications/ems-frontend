import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFieldsComponent } from './layer-fields.component';
import { EditableTextModule } from '../../../../editable-text/editable-text.module';
import { IconModule } from '@oort-front/ui';

/**
 * Map layer fields settings module.
 */
@NgModule({
  declarations: [LayerFieldsComponent],
  imports: [CommonModule, IconModule, EditableTextModule],
  exports: [LayerFieldsComponent],
})
export class LayerFieldsModule {}
