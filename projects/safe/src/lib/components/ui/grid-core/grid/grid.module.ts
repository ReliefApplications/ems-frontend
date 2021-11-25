import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeExpandedCommentModule } from '../expanded-comment/expanded-comment.module';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { SafeDropdownFilterModule } from '../dropdown-filter/dropdown-filter.module';
import { SafeDropdownFilterMenuModule } from '../dropdown-filter-menu/dropdown-filter-menu.module';
import { SafeArrayFilterModule } from '../array-filter/array-filter.module';
import { SafeArrayFilterMenuModule } from '../array-filter-menu/array-filter-menu.module';
import { SafeGridToolbarModule } from '../grid-toolbar/grid-toolbar.module';
import { SafeGridRowActionsModule } from '../grid-row-actions/grid-row-actions.module';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';


@NgModule({
  declarations: [
    SafeGridComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SafeExpandedCommentModule,
    // === MATERIAL ===
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    // === KENDO ===
    GridModule,
    ButtonModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    ButtonsModule,
    // === TOOLBAR ===
    SafeGridToolbarModule,
    // === DETAILS ===
    SafeGridRowActionsModule,
    // === FILTER ===
    SafeDropdownFilterModule,
    SafeDropdownFilterMenuModule,
    SafeArrayFilterModule,
    SafeArrayFilterMenuModule
  ],
  exports: [
    SafeGridComponent
  ]
})
export class SafeGridModule { }
