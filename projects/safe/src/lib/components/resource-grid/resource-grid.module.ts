import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeResourceGridComponent } from './resource-grid.component';
import { SafeGridColumnModule } from "../grid-column/grid-column.module";

@NgModule({
  declarations: [SafeResourceGridComponent],
    imports: [
        CommonModule,
        GridModule,
        GroupModule,
        ButtonModule,
        MatSelectModule,
        MatDialogModule,
        SafeGridColumnModule,
    ],
  exports: [SafeResourceGridComponent]
})
export class SafeResourceGridModule { }
