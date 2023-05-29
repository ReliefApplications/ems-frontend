import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import {
  SafeAccessModule,
  SafeWorkflowStepperModule,
  SafeIconModule,
  SafeSkeletonModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeSearchMenuModule } from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import {
  AlertModule,
  ButtonModule,
  MenuModule,
  SpinnerModule,
} from '@oort-front/ui';

/**
 * Application workflow page module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SafeAccessModule,
    SpinnerModule,
    SafeWorkflowStepperModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    MatIconModule,
    MenuModule,
    IndicatorsModule,
    SafeIconModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
    ButtonModule,
    AlertModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
