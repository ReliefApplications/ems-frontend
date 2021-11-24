import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeGridCoreComponent } from './grid-core.component';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
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
    MatMenuModule,
    GroupModule,
    MatCheckboxModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    SafeRecordModalModule,
    ButtonsModule,
    MatDividerModule,
    SafeGridModule
  ],
  exports: [
    SafeGridCoreComponent
  ]
})
export class SafeGridCoreModule { }
