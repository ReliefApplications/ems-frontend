import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import {
  SafeAccessModule,
  SafeAlertModule,
  SafeButtonModule,
  SafeWorkflowStepperModule,
  SafeIconModule,
  SafeSkeletonModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeSearchMenuModule } from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from '@oort-front/ui';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';

/**
 * Application workflow page module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    SafeAccessModule,
    MatProgressSpinnerModule,
    SafeButtonModule,
    SafeWorkflowStepperModule,
    TranslateModule,
    OverlayModule,
    SafeSearchMenuModule,
    MatIconModule,
    MenuModule,
    IndicatorsModule,
    SafeAlertModule,
    SafeIconModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
