import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';


import { RecordHistoryComponent } from './record-history.component';


@NgModule({
  declarations: [
    RecordHistoryComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  exports: [RecordHistoryComponent]
})
export class RecordHistoryModule { }
