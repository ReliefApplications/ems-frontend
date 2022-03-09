import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowWidgetComponent } from './workflow-widget.component';
import { WorkflowModule } from '../../components/workflow/workflow.module';

@NgModule({
  declarations: [WorkflowWidgetComponent],
  imports: [CommonModule, WorkflowModule],
  exports: [WorkflowWidgetComponent],
})
export class WorkflowWidgetModule {}
