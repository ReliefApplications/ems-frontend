import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import {
  WorkflowStepperModule,
  SkeletonModule,
  EditableTextModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonModule, SpinnerModule } from '@oort-front/ui';

/**
 * Application workflow page module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SpinnerModule,
    WorkflowStepperModule,
    TranslateModule,
    IconModule,
    IndicatorsModule,
    SkeletonModule,
    EditableTextModule,
    ButtonModule,
    TooltipModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
