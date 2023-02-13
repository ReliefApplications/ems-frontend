import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeWorkflowStepperModule } from '@safe/builder';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    MatProgressSpinnerModule,
    SafeWorkflowStepperModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
