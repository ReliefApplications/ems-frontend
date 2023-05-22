import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import {
  SafeAccessModule,
  SafeAlertModule,
  SafeButtonModule,
  SafeWorkflowStepperModule,
  SafeSkeletonModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeSearchMenuModule } from '@oort-front/safe';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { UiModule } from '@oort-front/ui';

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
    SafeButtonModule,
    SafeWorkflowStepperModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    MatMenuModule,
    IndicatorsModule,
    SafeAlertModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
    UiModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
