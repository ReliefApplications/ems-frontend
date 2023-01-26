import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerFieldsComponent } from './layer-fields.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from 'projects/safe/src/lib/components/ui/button/button.module';

/** Module for the Layer Fields Component */
@NgModule({
  declarations: [SafeLayerFieldsComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule],
  exports: [SafeLayerFieldsComponent],
})
export class SafeLayerFieldsModule {}
