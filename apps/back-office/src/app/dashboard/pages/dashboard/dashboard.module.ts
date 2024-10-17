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
  DashboardExportButtonComponent,
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
  ToggleModule,
} from '@oort-front/ui';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { ContextSelectorComponent } from './components/context-selector/context-selector.component';

/**
 * Dashboard page module.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    PDFExportModule,
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
    ToggleModule,
    ContextSelectorComponent,
    DashboardExportButtonComponent,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
