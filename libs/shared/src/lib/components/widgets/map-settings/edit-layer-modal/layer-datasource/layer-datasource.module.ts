import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDatasourceComponent } from './layer-datasource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  FormWrapperModule,
  SelectMenuModule,
  DividerModule,
  TooltipModule,
} from '@oort-front/ui';
import { AggregationOriginSelectComponent } from '../../../../aggregation/aggregation-origin-select/aggregation-origin-select.component';

/** Module for the LayerDatasourceComponent */
@NgModule({
  declarations: [LayerDatasourceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectMenuModule,
    ButtonModule,
    DividerModule,
    TranslateModule,
    FormWrapperModule,
    ButtonModule,
    TooltipModule,
    AggregationOriginSelectComponent,
  ],
  exports: [LayerDatasourceComponent],
})
export class LayerDatasourceModule {}
