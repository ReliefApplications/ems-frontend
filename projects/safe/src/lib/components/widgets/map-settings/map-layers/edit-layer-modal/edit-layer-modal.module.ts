import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { SafeEditLayerModalComponent } from './edit-layer-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeLayerPropertiesModule } from './layer-properties/layer-properties.module';
import { SafeLayerDatasourceModule } from './layer-datasource/layer-datasource.module';
import { SafeLayerFilterModule } from './layer-filter/layer-filter.module';
import { SafeLayerAggregationModule } from './layer-aggregation/layer-aggregation.module';
import { SafeLayerPopupModule } from './layer-popup/layer-popup.module';
import { SafeLayerFieldsModule } from './layer-fields/layer-fields.module';
import { SafeLayerLabelsModule } from './layer-labels/layer-labels.module';

/** Module for the SafeEditLayerModalComponent */
@NgModule({
  declarations: [SafeEditLayerModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    TranslateModule,
    MatTabsModule,
    SafeIconModule,
    SafeLayerPropertiesModule,
    SafeLayerDatasourceModule,
    SafeLayerFilterModule,
    SafeLayerAggregationModule,
    SafeLayerPopupModule,
    SafeLayerFieldsModule,
    SafeLayerLabelsModule,
  ],
  exports: [SafeEditLayerModalComponent],
})
export class SafeEditLayerModalModule {}
