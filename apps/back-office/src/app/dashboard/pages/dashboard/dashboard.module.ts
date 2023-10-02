import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  AccessModule,
  RecordHistoryModule,
  WidgetGridModule,
  SkeletonModule,
  SearchMenuModule,
  EditableTextModule,
  FullScreenModule,
  DashboardFilterModule,
  ButtonActionModule,
} from '@oort-front/shared';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MenuModule,
  TooltipModule,
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  AlertModule,
  DialogModule,
  GraphQLSelectModule,
} from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';

/**
 * Dashboard page module.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    AccessModule,
    WidgetGridModule,
    IconModule,
    DialogModule,
    MenuModule,
    ClipboardModule,
    RecordHistoryModule,
    TranslateModule,
    OverlayModule,
    SearchMenuModule,
    SkeletonModule,
    EditableTextModule,
    FullScreenModule,
    FormsModule,
    ReactiveFormsModule,
    DashboardFilterModule,
    TooltipModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    GraphQLSelectModule,
    AlertModule,
    DragDropModule,
    ButtonActionModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
