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
  DashboardExportButtonComponent,
  ActionButtonsComponent,
} from '@oort-front/shared';
import { ClipboardModule } from '@angular/cdk/clipboard';
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
  IconModule,
} from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ContextSelectorComponent } from './components/context-selector/context-selector.component';

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
    ActionButtonsComponent,
    ContextSelectorComponent,
    DashboardExportButtonComponent,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
