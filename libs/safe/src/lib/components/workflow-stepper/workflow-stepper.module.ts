import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeAddStepComponent } from './components/add-step/add-step.component';
import { SafeStepComponent } from './components/step/step.component';
import { MatRippleModule } from '@angular/material/core';
import { SafeIconModule } from '../ui/icon/icon.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TooltipModule, DividerModule, ButtonModule } from '@oort-front/ui';
/**
 * Module for workflow stepper component
 */
@NgModule({
  declarations: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent,
  ],
  imports: [
    CommonModule,
    DividerModule,
    MatRippleModule,
    TooltipModule,
    DragDropModule,
    SafeIconModule,
    TranslateModule,
    IndicatorsModule,
    ButtonModule,
  ],
  exports: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent,
  ],
})
export class SafeWorkflowStepperModule {}
