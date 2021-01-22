import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoGridComponent } from './grid.component';
import { WhoSubGridComponent } from './sub-grid/sub-grid.component';
import {ExcelModule, GridModule, GroupModule} from '@progress/kendo-angular-grid';
import { WhoFormModalModule } from '../../form-modal/form-modal.module';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {ButtonModule} from '@progress/kendo-angular-buttons';
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  declarations: [
    WhoGridComponent,
    WhoSubGridComponent
  ],
  imports: [
    CommonModule,
    GridModule,
    ExcelModule,
    WhoFormModalModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    GroupModule,
    ButtonModule,
    MatCheckboxModule
  ],
  exports: [WhoGridComponent]
})
export class WhoGridModule { }
