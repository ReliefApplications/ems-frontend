import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerAggregationComponent } from './layer-aggregation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { LayerClusterModule } from '../layer-cluster/layer-cluster.module';

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
    MatSelectModule,
    MatFormFieldModule,
    LayerClusterModule,
  ],
  exports: [LayerAggregationComponent],
})
export class LayerAggregationModule {}
