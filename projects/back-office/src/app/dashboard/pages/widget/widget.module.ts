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
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

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
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatTooltipModule,
    MatMenuModule,
    ClipboardModule,
    SafeRecordHistoryModule,
    SafeButtonModule,
    TranslateModule,
    DashboardModule,
  ],
  exports: [WidgetComponent],
})
export class WidgetModule {}
