import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowWidgetComponent } from './workflow-widget.component';
import { WorkflowModule } from '../../components/workflow/workflow.module';
import { MatSidenavModule } from '@angular/material/sidenav';

/** Workflow web widget module */
@NgModule({
  declarations: [WorkflowWidgetComponent],
  imports: [CommonModule, WorkflowModule, MatSidenavModule],
  exports: [WorkflowWidgetComponent],
})
export class WorkflowWidgetModule {}
