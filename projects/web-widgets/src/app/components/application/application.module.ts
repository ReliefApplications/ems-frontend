import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WorkflowModule } from '../workflow/workflow.module';
import { DashboardModule } from '../dashboard/dashboard.module';
import { FormModule } from '../form/form.module';

/** Application module */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    WorkflowModule,
    DashboardModule,
    FormModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
