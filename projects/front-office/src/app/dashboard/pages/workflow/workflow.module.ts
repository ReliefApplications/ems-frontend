import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatIconModule,
  ],
  exports: [WorkflowComponent]
})
export class WorkflowModule { }
