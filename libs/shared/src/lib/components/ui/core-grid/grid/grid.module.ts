import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IconModule,
  MenuModule,
  TextareaModule,
  TooltipModule,
  ButtonModule as uiButtonModule,
} from '@oort-front/ui';
import { ButtonModule, ButtonsModule } from '@progress/kendo-angular-buttons';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { GridModule as KendoGridModule } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { StripHtmlPipe } from '../../../../pipes/strip-html/strip-html.pipe';
import { DateFilterMenuModule } from '../date-filter-menu/date-filter-menu.module';
import { ExpandedCommentModule } from '../expanded-comment/expanded-comment.module';
import { ExportModule } from '../export/export.module';
import { GridFilterMenuModule } from '../filter-menu/filter-menu.module';
import { GridFilterModule } from '../filter/filter.module';
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
    MenuModule,
    // === KENDO ===
    KendoGridModule,
    ButtonModule,
    InputsModule,
    DateInputsModule,
    DropDownsModule,
    ButtonsModule,
    // === UTILS ===
    ExpandedCommentModule,
    // === FILTER ===
    GridFilterModule,
    GridFilterMenuModule,
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
    TextareaModule,
    uiButtonModule,
    // === Pipes ==
    StripHtmlPipe,
  ],
  exports: [GridComponent],
})
export class GridModule {}
