import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { SpinnerModule } from '@oort-front/ui';
import { SafeWidgetGridModule } from '@oort-front/safe';

/** Dashboard module. */
@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, SpinnerModule, SafeWidgetGridModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
