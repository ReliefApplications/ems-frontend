import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeResourceGridComponent } from './resource-grid.component';
import { ColorPickerModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropDownListModule, MultiSelectModule } from '@progress/kendo-angular-dropdowns';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePickerModule, DateTimePickerModule, TimePickerModule } from '@progress/kendo-angular-dateinputs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SafeResourceGridComponent],
  imports: [
    CommonModule,
    GridModule,
    GroupModule,
    ButtonModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    TextBoxModule,
    FormsModule,
    ReactiveFormsModule,
    MultiSelectModule,
    DropDownListModule,
    MatTooltipModule,
    DateTimePickerModule,
    TimePickerModule,
    ColorPickerModule,
    MatIconModule,
    DatePickerModule
  ],
  exports: [SafeResourceGridComponent]
})
export class SafeResourceGridModule {
}
