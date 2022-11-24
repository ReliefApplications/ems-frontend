import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipelineComponent } from './pipeline.component';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeButtonModule } from '../../button/button.module';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeGroupStageComponent } from './group-stage/group-stage.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SafeAddFieldStageComponent } from './add-field-stage/add-field-stage.component';
import { SafeExpressionsComponent } from './expressions/expressions.component';
import { SafeFieldDropdownComponent } from './field-dropdown/field-dropdown.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeIconModule } from '../../icon/icon.module';
import { SafeFilterModule } from '../../../filter/filter.module';
import { SafeSortStageComponent } from './sort-stage/sort-stage.component';

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
    SafeButtonModule,
    MatMenuModule,
    TranslateModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DragDropModule,
    SafeIconModule,
    MatTooltipModule,
    SafeFilterModule,
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
