import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationTableComponent } from './aggregation-table.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule, TableModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeDateModule } from '../../../pipes/date/date.module';

/** Module for aggregation table component */
@NgModule({
  declarations: [AggregationTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    MatIconModule,
    DragDropModule,
    SafeButtonModule,
    SafeDateModule,
    TableModule,
  ],
  exports: [AggregationTableComponent],
})
export class AggregationTableModule {}
