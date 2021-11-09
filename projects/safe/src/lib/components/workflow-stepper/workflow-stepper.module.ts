import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';

@NgModule({
  declarations: [
    SafeWorkflowStepperComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafeWorkflowStepperComponent
  ]
})
export class SafeWorkflowStepperModule { }
