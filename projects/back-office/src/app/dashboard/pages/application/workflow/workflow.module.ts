import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';


@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule
  ]
})
export class WorkflowModule { }
