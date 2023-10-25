import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { SpinnerModule } from '@oort-front/ui';
import { SkeletonModule, WorkflowStepperModule } from '@oort-front/shared';

/**
 * Workflow page module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SpinnerModule,
    WorkflowStepperModule,
    SkeletonModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
