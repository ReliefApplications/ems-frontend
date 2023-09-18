import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IconModule,
  TextareaModule,
  TooltipModule,
  ButtonModule as uiButtonModule,
} from '@oort-front/ui';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule as KendoGridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { DateModule } from '../../../../pipes/date/date.module';
import { ArrayFilterMenuModule } from '../array-filter-menu/array-filter-menu.module';
import { ArrayFilterModule } from '../array-filter/array-filter.module';
import { DateFilterMenuModule } from '../date-filter-menu/date-filter-menu.module';
import { DropdownFilterMenuModule } from '../dropdown-filter-menu/dropdown-filter-menu.module';
import { DropdownFilterModule } from '../dropdown-filter/dropdown-filter.module';
import { ExpandedCommentModule } from '../expanded-comment/expanded-comment.module';
import { ExportModule } from '../export/export.module';
import { GridColumnChooserModule } from '../grid-column-chooser/grid-column-chooser.module';
import { GridRowActionsModule } from '../row-actions/row-actions.module';
import { GridToolbarModule } from '../toolbar/toolbar.module';
import { GridComponent } from './grid.component';

/** Module for the grid component */
@NgModule({
  declarations: [GridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TooltipModule,
    // === KENDO ===
    KendoGridModule,
    ButtonModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    ButtonsModule,
    PopupModule,
    // === UTILS ===
    ExpandedCommentModule,
    // === FILTER ===
    ArrayFilterModule,
    ArrayFilterMenuModule,
    DropdownFilterModule,
    DropdownFilterMenuModule,
    DateFilterMenuModule,
    GridColumnChooserModule,
    // === ROW ===
    GridRowActionsModule,
    // === TOOLBAR ===
    GridToolbarModule,
    // === EXPORT ===
    ExportModule,
    // === TRANSLATE ===
    TranslateModule,
    DateModule,
    TextareaModule,
    uiButtonModule,
  ],
  exports: [GridComponent],
})
export class GridModule {}
