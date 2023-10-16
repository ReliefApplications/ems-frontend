import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowStepperComponent } from './workflow-stepper.component';
import { AddStepComponent } from './components/add-step/add-step.component';
import { StepComponent } from './components/step/step.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import {
  TooltipModule,
  ButtonModule,
  IconModule,
  TabsModule,
} from '@oort-front/ui';
/**
 * Module for workflow stepper component
 */
@NgModule({
  declarations: [WorkflowStepperComponent, AddStepComponent, StepComponent],
  imports: [
    CommonModule,
    TooltipModule,
    DragDropModule,
    IconModule,
    TranslateModule,
    IndicatorsModule,
    ButtonModule,
    TabsModule,
  ],
  exports: [WorkflowStepperComponent, AddStepComponent, StepComponent],
})
export class WorkflowStepperModule {}
