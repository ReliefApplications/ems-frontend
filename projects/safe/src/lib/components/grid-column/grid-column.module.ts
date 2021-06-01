import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { HttpClientModule } from '@angular/common/http';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeGridColumnComponent } from './grid-column.component';

@NgModule({
  declarations: [SafeGridColumnComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ExcelModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GroupModule,
    ButtonModule,
    MatCheckboxModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    MatTooltipModule,
    ButtonsModule
  ],
  exports: [SafeGridColumnComponent]
})
export class SafeGridColumnModule { }
