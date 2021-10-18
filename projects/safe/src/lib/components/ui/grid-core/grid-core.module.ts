import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeGridCoreComponent } from './grid-core.component';
import { ExcelModule, GridModule, GroupModule } from '@progress/kendo-angular-grid';
import { SafeFormModalModule } from '../../form-modal/form-modal.module';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { SafeRecordModalModule } from '../../record-modal/record-modal.module';
import { SafeChooseRecordModalModule } from '../../choose-record-modal/choose-record-modal.module';
import { SafeExpandedCommentModule } from './expanded-comment/expanded-comment.module';
import { SafeArrayFilterModule } from './array-filter/array-filter.module';
import { SafeArrayFilterMenuModule } from './array-filter-menu/array-filter-menu.module';
import { SafeDropdownFilterModule } from './dropdown-filter/dropdown-filter.module';
import { SafeDropdownFilterMenuModule } from './dropdown-filter-menu/dropdown-filter-menu.module';

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
    SafeRecordModalModule,
    SafeChooseRecordModalModule,
    SafeExpandedCommentModule,
    MatTooltipModule,
    ButtonsModule,
    SafeArrayFilterModule,
    SafeArrayFilterMenuModule,
    SafeDropdownFilterModule,
    SafeDropdownFilterMenuModule,
    MatDividerModule,
  ],
  exports: [
    SafeGridCoreComponent
  ]
})
export class SafeGridCoreModule { }
