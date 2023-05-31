import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeGridComponent } from './grid.component';
import { SafeGridRowActionsModule } from '../row-actions/row-actions.module';
import { SafeGridToolbarModule } from '../toolbar/toolbar.module';
import { SafeArrayFilterModule } from '../array-filter/array-filter.module';
import { SafeArrayFilterMenuModule } from '../array-filter-menu/array-filter-menu.module';
import { SafeDropdownFilterModule } from '../dropdown-filter/dropdown-filter.module';
import { SafeDropdownFilterMenuModule } from '../dropdown-filter-menu/dropdown-filter-menu.module';
import { SafeExpandedCommentModule } from '../expanded-comment/expanded-comment.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SafeExportModule } from '../export/export.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../../pipes/date/date.module';
import { SafeDateFilterMenuModule } from '../date-filter-menu/date-filter-menu.module';
import {
  TextareaModule,
  TooltipModule,
  ButtonModule as uiButtonModule,
} from '@oort-front/ui';

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
    // === UTILS ===
    SafeExpandedCommentModule,
    // === FILTER ===
    SafeArrayFilterModule,
    SafeArrayFilterMenuModule,
    SafeDropdownFilterModule,
    SafeDropdownFilterMenuModule,
    SafeDateFilterMenuModule,
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
