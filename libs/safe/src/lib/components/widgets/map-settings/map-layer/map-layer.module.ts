import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-layer.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { LayerPropertiesModule } from './layer-properties/layer-properties.module';
import { LayerDatasourceModule } from './layer-datasource/layer-datasource.module';
import { LayerFieldsModule } from './layer-fields/layer-fields.module';
import { LayerAggregationModule } from './layer-aggregation/layer-aggregation.module';
import { LayerPopupModule } from './layer-popup/layer-popup.module';
import { LayerLabelsModule } from './layer-labels/layer-labels.module';
import { LayerFilterModule } from './layer-filter/layer-filter.module';
import { LayerClusterModule } from './layer-cluster/layer-cluster.module';
import { LayerStylingModule } from './layer-styling/layer-styling.module';
import { MapLayersModule } from '../map-layers/map-layers.module';

/**
 * Map layer settings component.
 */
@NgModule({
  declarations: [MapLayerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeButtonModule,
    LayerPropertiesModule,
    LayerDatasourceModule,
    LayerFieldsModule,
    LayerAggregationModule,
    LayerPopupModule,
    LayerClusterModule,
    LayerLabelsModule,
    LayerFilterModule,
    LayerStylingModule,
    MapLayersModule,
  ],
  exports: [MapLayerComponent],
})
export class MapLayerModule {}
