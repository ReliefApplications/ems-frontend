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
import { SafeErrorsModalModule } from '../errors-modal/errors-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GridModule } from '@progress/kendo-angular-grid';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SafeExportModule } from '../export/export.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeDateModule } from '../../../../pipes/date/date.module';

/** Module for the grid component */
@NgModule({
  declarations: [SafeGridComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    // === UTILS ===
    SafeExpandedCommentModule,
    SafeErrorsModalModule,
    // === FILTER ===
    SafeArrayFilterModule,
    SafeArrayFilterMenuModule,
    SafeDropdownFilterModule,
    SafeDropdownFilterMenuModule,
    // === ROW ===
    SafeGridRowActionsModule,
    // === TOOLBAR ===
    SafeGridToolbarModule,
    // === EXPORT ===
    SafeExportModule,
    // === TRANSLATE ===
    TranslateModule,
    SafeDateModule,
  ],
  exports: [SafeGridComponent],
})
export class SafeGridModule {}
