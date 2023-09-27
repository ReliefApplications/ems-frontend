import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { SpinnerModule, DividerModule } from '@oort-front/ui';
import { WorkflowStepperModule } from '@oort-front/shared';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SpinnerModule,
    WorkflowStepperModule,
    DividerModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
