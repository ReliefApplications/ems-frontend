import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WidgetRoutingModule } from './widget-routing.module';
import { WidgetComponent } from './widget.component';
import {
  SafeAccessModule,
  SafeRecordHistoryModule,
  SafeWidgetGridModule,
  SafeButtonModule,
} from '@safe/builder';
import { DashboardModule } from '../dashboard/dashboard.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { 
  ButtonModule,
  DialogModule,
  IconModule,
  MenuModule,
  SpinnerModule,
  SelectMenuModule,
  TooltipModule, 
} from '@oort-front/ui';

@NgModule({
  declarations: [WidgetComponent],
  imports: [
    CommonModule,
    WidgetRoutingModule,
    SafeAccessModule,
    SafeWidgetGridModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    IconModule,
    MenuModule,
    SpinnerModule,
    SelectMenuModule,
    TooltipModule,
    ClipboardModule,
    DialogModule,
    SafeRecordHistoryModule,
    ButtonModule,
    TranslateModule,
    DashboardModule,
  ],
  exports: [WidgetComponent],
})
export class WidgetModule {}