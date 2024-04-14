import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStatesComponent } from './dashboard-states.component';
import { EmptyModule } from '@oort-front/shared';
import {
  ButtonModule,
  DialogModule,
  FormWrapperModule,
  IconModule,
  MenuModule,
  TableModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateModalComponent } from './state-modal/state-modal.component';

/**
 * Module for the DashboardStatesComponent
 */
@NgModule({
  declarations: [DashboardStatesComponent, StateModalComponent],
  imports: [
    CommonModule,
    EmptyModule,
    ButtonModule,
    TranslateModule,
    ToggleModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    DialogModule,
    FormWrapperModule,
    MenuModule,
    TooltipModule,
    IconModule,
  ],
  exports: [DashboardStatesComponent],
})
export class DashboardStatesModule {}
