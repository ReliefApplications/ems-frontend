import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayerDatasourceComponent } from './layer-datasource.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BadgeModule } from '../../../../ui/badge/badge.module';
import {
  AlertModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
  SelectMenuModule,
  GraphQLSelectModule,
  DividerModule,
  TooltipModule,
} from '@oort-front/ui';
import { PortalModule } from '@angular/cdk/portal';

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
    BadgeModule,
    TableModule,
    ButtonModule,
    AlertModule,
    TooltipModule,
    PortalModule,
  ],
  exports: [LayerDatasourceComponent],
})
export class LayerDatasourceModule {}
