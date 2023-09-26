import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerAggregationComponent } from './layer-aggregation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LayerClusterModule } from '../layer-cluster/layer-cluster.module';
import { FormWrapperModule, SelectMenuModule } from '@oort-front/ui';

/**
 * Map layer aggregation settings module.
 */
@NgModule({
  declarations: [LayerAggregationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    LayerClusterModule,
    SelectMenuModule,
  ],
  exports: [LayerAggregationComponent],
})
export class LayerAggregationModule {}
