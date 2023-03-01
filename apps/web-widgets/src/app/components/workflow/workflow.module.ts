import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowComponent } from './workflow.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SafeWorkflowStepperModule } from '@oort-front/safe';
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
