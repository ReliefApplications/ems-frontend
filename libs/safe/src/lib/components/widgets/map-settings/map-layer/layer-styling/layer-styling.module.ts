import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerStylingComponent } from './layer-styling.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { SimpleRendererComponent } from './simple-renderer/simple-renderer.component';
import { HeatmapRendererComponent } from './heatmap-renderer/heatmap-renderer.component';
import { UniqueValueRendererComponent } from './unique-value-renderer/unique-value-renderer.component';

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
    MatSelectModule,
    MatFormFieldModule,
    SimpleRendererComponent,
    HeatmapRendererComponent,
    UniqueValueRendererComponent,
  ],
  exports: [LayerStylingComponent],
})
export class LayerStylingModule {}
