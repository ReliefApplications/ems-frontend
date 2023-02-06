import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AggregationTableComponent } from './aggregation-table.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { AddAggregationModalModule } from '../add-aggregation-modal/add-aggregation-modal.module';
import { SafeEditAggregationModalModule } from '../edit-aggregation-modal/edit-aggregation-modal.module';

/** Module for aggregation table component */
@NgModule({
  declarations: [AggregationTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    SafeButtonModule,
    AddAggregationModalModule,
    SafeEditAggregationModalModule,
    SafeDateModule,
  ],
  exports: [AggregationTableComponent],
})
export class AggregationTableModule {}
