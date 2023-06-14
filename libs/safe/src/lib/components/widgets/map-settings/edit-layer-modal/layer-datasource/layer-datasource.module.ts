import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDatasourceComponent } from './layer-datasource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeBadgeModule } from '../../../../ui/badge/badge.module';
import {
  AlertModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  SelectMenuModule,
  GraphQLSelectModule,
  DividerModule,
} from '@oort-front/ui';

/** Module for the LayerDatasourceComponent */
@NgModule({
  declarations: [LayerDatasourceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectMenuModule,
    TranslateModule,
    GraphQLSelectModule,
    ButtonModule,
    DividerModule,
    TranslateModule,
    FormWrapperModule,
    SafeBadgeModule,
    TableModule,
    ButtonModule,
    AlertModule,
  ],
  exports: [LayerDatasourceComponent],
})
export class LayerDatasourceModule {}
