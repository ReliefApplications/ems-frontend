import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeWorkflowStepperComponent } from './workflow-stepper.component';
import { SafeAddStepComponent } from './components/add-step/add-step.component';
import { SafeStepComponent } from './components/step/step.component';
import { MatRippleModule } from '@angular/material/core';
import { SafeIconModule } from '../ui/icon/icon.module';
import { SafeButtonModule } from '../ui/button/public-api';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { DividerModule } from '@oort-front/ui';
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
    MatTooltipModule,
    DragDropModule,
    SafeIconModule,
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
