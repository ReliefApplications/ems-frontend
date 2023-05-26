import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipelineComponent } from './pipeline.component';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeGroupStageComponent } from './group-stage/group-stage.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeAddFieldStageComponent } from './add-field-stage/add-field-stage.component';
import { SafeExpressionsComponent } from './expressions/expressions.component';
import { SafeFieldDropdownComponent } from './field-dropdown/field-dropdown.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeIconModule } from '../../icon/icon.module';
import { SafeFilterModule } from '../../../filter/filter.module';
import { SafeSortStageComponent } from './sort-stage/sort-stage.component';
import {
  TextareaModule,
  FormWrapperModule,
  MenuModule,
  TooltipModule,
  ButtonModule,
  ExpansionPanelModule,
} from '@oort-front/ui';

/**
 * Aggregation builder pipeline module.
 */
@NgModule({
  declarations: [
    SafePipelineComponent,
    SafeGroupStageComponent,
    SafeAddFieldStageComponent,
    SafeExpressionsComponent,
    SafeFieldDropdownComponent,
    SafeSortStageComponent,
  ],
  imports: [
    CommonModule,
    SafeQueryBuilderModule,
    MenuModule,
    TranslateModule,
    ExpansionPanelModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    SafeIconModule,
    TooltipModule,
    SafeFilterModule,
    TextareaModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [
    SafePipelineComponent,
    SafeGroupStageComponent,
    SafeAddFieldStageComponent,
    SafeExpressionsComponent,
    SafeFieldDropdownComponent,
    SafeSortStageComponent,
  ],
})
export class SafePipelineModule {}
