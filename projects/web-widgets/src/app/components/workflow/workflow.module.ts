import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SafeWorkflowStepperModule } from '@safe/builder';
import { DashboardModule } from '../dashboard/dashboard.module';
import { FormModule } from '../form/form.module';

/**
 * Workflow module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    SafeWorkflowStepperModule,
    DashboardModule,
    FormModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
