import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../ui/modal/modal.module';
import { MapModule } from '../../../ui/map/map.module';
import { MapLayerComponent } from './map-layer.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { IconPickerModule } from '../../../icon-picker/icon-picker.module';
import { LayerPropertiesModule } from './layer-properties/layer-properties.module';
import { LayerAggregationModule } from './layer-aggregation/layer-aggregation.module';
import { LayerFieldsModule } from './layer-fields/layer-fields.module';
import { LayerFilterModule } from './layer-filter/layer-filter.module';
import { LayerLabelsModule } from './layer-labels/layer-labels.module';
import { LayerPopupModule } from './layer-popup/layer-popup.module';
import { LayerClusterModule } from './layer-cluster/layer-cluster.module';
import { LayerDatasourceModule } from './layer-datasource/layer-datasource.module';

/** Module for the MapLayerComponent */
@NgModule({
  declarations: [MapLayerComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatTabsModule,
    MapModule,
    IconPickerModule,
    LayerPropertiesModule,
    LayerAggregationModule,
    LayerFieldsModule,
    LayerFilterModule,
    LayerLabelsModule,
    LayerPopupModule,
    LayerClusterModule,
    LayerDatasourceModule,
  ],
  exports: [MapLayerComponent],
})
export class SafeMapLayerModule {}
