import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkflowRoutingModule } from './workflow-routing.module';
import { WorkflowComponent } from './workflow.component';
import {
  AccessModule,
  WorkflowStepperModule,
  SkeletonModule,
  EditableTextModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { SearchMenuModule } from '@oort-front/shared';
import { IconModule, TooltipModule } from '@oort-front/ui';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import {
  AlertModule,
  ButtonModule,
  MenuModule,
  SpinnerModule,
  DividerModule,
} from '@oort-front/ui';

/**
 * Application workflow page module.
 */
@NgModule({
  declarations: [WorkflowComponent],
  imports: [
    CommonModule,
    WorkflowRoutingModule,
    AccessModule,
    SpinnerModule,
    WorkflowStepperModule,
    TranslateModule,
    OverlayModule,
    SearchMenuModule,
    IconModule,
    MenuModule,
    IndicatorsModule,
    SkeletonModule,
    EditableTextModule,
    ButtonModule,
    AlertModule,
    TooltipModule,
    DividerModule,
  ],
  exports: [WorkflowComponent],
})
export class WorkflowModule {}
