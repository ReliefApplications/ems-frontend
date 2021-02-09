import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WhoGridComponent } from './grid.component';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { WhoFormModalModule } from '../../form-modal/form-modal.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [
    WhoGridComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ExcelModule,
    WhoFormModalModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    GroupModule,
    ButtonModule,
    MatCheckboxModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
