import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeGridCoreComponent } from './grid-core.component';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { SafeRecordModalModule } from '../../record-modal/record-modal.module';
import { SafeGridModule } from './grid/grid.module';

@NgModule({
  declarations: [
    SafeGridCoreComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ExcelModule,
    SafeFormModalModule,
    GroupModule,
    MatCheckboxModule,
    SafeRecordModalModule,
    MatDividerModule,
    SafeGridModule
  ],
  exports: [
    SafeGridCoreComponent
  ]
})
export class SafeGridCoreModule { }
