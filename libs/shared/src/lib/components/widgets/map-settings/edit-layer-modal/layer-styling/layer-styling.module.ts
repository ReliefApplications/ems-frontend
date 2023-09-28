import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerStylingComponent } from './layer-styling.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SimpleRendererComponent } from './simple-renderer/simple-renderer.component';
import { HeatmapRendererComponent } from './heatmap-renderer/heatmap-renderer.component';
import { UniqueValueRendererComponent } from './unique-value-renderer/unique-value-renderer.component';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';

/**
 * Layer styling module.
 */
@NgModule({
  declarations: [LayerStylingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SelectMenuModule,
    FormWrapperModule,
    SimpleRendererComponent,
    HeatmapRendererComponent,
    UniqueValueRendererComponent,
  ],
  exports: [LayerStylingComponent],
})
export class LayerStylingModule {}
