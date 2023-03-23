import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerFieldsComponent } from './layer-fields.component';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeEditableTextModule } from '../../../../editable-text/editable-text.module';

/**
 * Map layer fields settings module.
 */
@NgModule({
  declarations: [LayerFieldsComponent],
  imports: [CommonModule, SafeIconModule, SafeEditableTextModule],
  exports: [LayerFieldsComponent],
})
export class LayerFieldsModule {}
