import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayerComponent } from './map-layer.component';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { LayerPropertiesModule } from './layer-properties/layer-properties.module';
import { LayerDatasourceModule } from './layer-datasource/layer-datasource.module';
import { LayerFieldsModule } from './layer-fields/layer-fields.module';

@NgModule({
  declarations: [MapLayerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    SafeButtonModule,
    LayerPropertiesModule,
    LayerDatasourceModule,
    LayerFieldsModule,
  ],
  exports: [MapLayerComponent],
})
export class MapLayerModule {}
