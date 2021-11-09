import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeAddStepComponent } from './components/add-step/add-step.component';
import { SafeStepComponent } from './components/step/step.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatRippleModule } from '@angular/material/core';
import { SafeIconModule } from '../ui/icon/icon.module';

@NgModule({
  declarations: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent
  ],
  imports: [
    CommonModule,
    MatDividerModule,
    MatRippleModule,
    SafeIconModule
  ],
  exports: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent
  ]
})
export class SafeWorkflowStepperModule { }
