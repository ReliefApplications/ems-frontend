import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';
import { ClassBreakRendererComponent } from './class-break-renderer/class-break-renderer.component';
import { HeatmapRendererComponent } from './heatmap-renderer/heatmap-renderer.component';
import { LayerStylingComponent } from './layer-styling.component';
import { SimpleRendererComponent } from './simple-renderer/simple-renderer.component';
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
    SelectMenuModule,
    FormWrapperModule,
    SimpleRendererComponent,
    HeatmapRendererComponent,
    UniqueValueRendererComponent,
    ClassBreakRendererComponent,
    PortalModule,
  ],
  exports: [LayerStylingComponent],
})
export class LayerStylingModule {}
