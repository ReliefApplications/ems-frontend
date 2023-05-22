import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeAddStepComponent } from './components/add-step/add-step.component';
import { SafeStepComponent } from './components/step/step.component';
import { MatRippleModule } from '@angular/material/core';
import { SafeButtonModule } from '../ui/button/public-api';
import { TooltipModule } from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { UiModule } from '@oort-front/ui';
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
    SafeDividerModule,
    MatRippleModule,
    TooltipModule,
    DragDropModule,
    UiModule,
    SafeButtonModule,
    TranslateModule,
    IndicatorsModule,
  ],
  exports: [
    SafeWorkflowStepperComponent,
    SafeAddStepComponent,
    SafeStepComponent,
  ],
})
export class SafeWorkflowStepperModule {}
