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
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { ButtonModule } from '@oort-front/ui';

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
    MatMenuModule,
    IndicatorsModule,
    SafeAlertModule,
    SafeIconModule,
    SafeSkeletonModule,
    SafeEditableTextModule,
    ButtonModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
