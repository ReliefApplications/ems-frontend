import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafePipelineComponent } from './pipeline.component';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { SafeButtonModule } from '../../button/button.module';
import { MenuModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeGroupStageComponent } from './group-stage/group-stage.component';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeAddFieldStageComponent } from './add-field-stage/add-field-stage.component';
import { SafeExpressionsComponent } from './expressions/expressions.component';
import { SafeFieldDropdownComponent } from './field-dropdown/field-dropdown.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule, ButtonModule } from '@oort-front/ui';
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
    MenuModule,
    TranslateModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    DragDropModule,
    SafeIconModule,
    TooltipModule,
    SafeFilterModule,
    ButtonModule,
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
