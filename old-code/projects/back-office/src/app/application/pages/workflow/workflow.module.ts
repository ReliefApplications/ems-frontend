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
} from '@safe/builder';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeSearchMenuModule } from '@safe/builder';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
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
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
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
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
