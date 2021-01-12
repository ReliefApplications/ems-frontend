import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecordHistoryModal } from './record-history-modal.component';
import { ExcelModule, GridModule } from '@progress/kendo-angular-grid';


@NgModule({
  declarations: [
    RecordHistoryModal,
  ],
  imports: [
    CommonModule,
    GridModule,
    ExcelModule,
  ],
  exports: [RecordHistoryModal]
})
export class WhoGridModule { }
