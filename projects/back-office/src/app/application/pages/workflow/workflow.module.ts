import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import { SafeAccessModule, SafeWorkflowStepperModule } from '@safe/builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { SafeButtonModule } from '@safe/builder';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    WorkflowComponent,
  ],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SafeAccessModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    MatTableModule,
    MatDividerModule,
    MatIconModule,
    SafeButtonModule,
    SafeWorkflowStepperModule
  ],
  exports: [WorkflowComponent]
})
export class WorkflowModule { }
