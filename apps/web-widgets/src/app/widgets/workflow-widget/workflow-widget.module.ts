import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowWidgetComponent } from './workflow-widget.component';
import { WorkflowModule } from '../../components/workflow/workflow.module';
import { SidenavContainerModule } from '@oort-front/ui';

/** Workflow web widget module */
@NgModule({
  declarations: [WorkflowWidgetComponent],
  imports: [CommonModule, WorkflowModule, SidenavContainerModule],
  exports: [WorkflowWidgetComponent],
})
export class WorkflowWidgetModule {}
