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
import { GridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { PopupModule } from '@progress/kendo-angular-popup';
import { SafeDateModule } from '../../../../pipes/date/date.module';
import { SafeArrayFilterMenuModule } from '../array-filter-menu/array-filter-menu.module';
import { SafeArrayFilterModule } from '../array-filter/array-filter.module';
import { SafeDateFilterMenuModule } from '../date-filter-menu/date-filter-menu.module';
import { SafeDropdownFilterMenuModule } from '../dropdown-filter-menu/dropdown-filter-menu.module';
import { SafeDropdownFilterModule } from '../dropdown-filter/dropdown-filter.module';
import { SafeExpandedCommentModule } from '../expanded-comment/expanded-comment.module';
import { SafeExportModule } from '../export/export.module';
import { SafeGridColumnChooserModule } from '../grid-column-chooser/grid-column-chooser.module';
import { SafeGridRowActionsModule } from '../row-actions/row-actions.module';
import { SafeGridToolbarModule } from '../toolbar/toolbar.module';
import { SafeGridComponent } from './grid.component';

/** Module for the grid component */
@NgModule({
  declarations: [SafeGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TooltipModule,
    // === KENDO ===
    GridModule,
    ButtonModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    ButtonsModule,
    PopupModule,
    // === UTILS ===
    SafeExpandedCommentModule,
    // === FILTER ===
    SafeArrayFilterModule,
    SafeArrayFilterMenuModule,
    SafeDropdownFilterModule,
    SafeDropdownFilterMenuModule,
    SafeDateFilterMenuModule,
    SafeGridColumnChooserModule,
    // === ROW ===
    SafeGridRowActionsModule,
    // === TOOLBAR ===
    SafeGridToolbarModule,
    // === EXPORT ===
    SafeExportModule,
    // === TRANSLATE ===
    TranslateModule,
    SafeDateModule,
    TextareaModule,
    uiButtonModule,
  ],
  exports: [SafeGridComponent],
})
export class SafeGridModule {}
