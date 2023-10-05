import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {
  RecordHistoryModule,
  WidgetGridModule,
  SkeletonModule,
  EditableTextModule,
  FullScreenModule,
  DashboardFilterModule,
  ButtonActionModule,
} from '@oort-front/shared';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
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
    WidgetGridModule,
    IconModule,
    DialogModule,
    MenuModule,
    ClipboardModule,
    RecordHistoryModule,
    TranslateModule,
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
