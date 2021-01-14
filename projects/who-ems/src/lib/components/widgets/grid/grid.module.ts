import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoGridComponent } from './grid.component';
import { WhoSubGridComponent } from './sub-grid/sub-grid.component';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';
import { WhoFormModalModule } from '../../form-modal/form-modal.module';
import { RecordHistoryComponent } from './components/record-history/record-history.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    WhoGridComponent,
    WhoSubGridComponent,
    RecordHistoryComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    ExcelModule,
    WhoFormModalModule,
    MatTableModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
