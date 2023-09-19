import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationTableComponent } from './aggregation-table.component';
import { DividerModule, IconModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DateModule } from '../../../pipes/date/date.module';
import { MenuModule, ButtonModule, TableModule } from '@oort-front/ui';

/** Module for aggregation table component */
@NgModule({
  declarations: [AggregationTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    IconModule,
    DragDropModule,
    DateModule,
    ButtonModule,
    TableModule,
    DividerModule,
    TooltipModule,
  ],
  exports: [AggregationTableComponent],
})
export class AggregationTableModule {}
