import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeAddStepComponent } from './components/add-step/add-step.component';
import { SafeStepComponent } from './components/step/step.component';

@NgModule({
  declarations: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SafeWorkflowStepperComponent
  ]
})
export class SafeWorkflowStepperModule { }
