import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDashboardFilterComponent } from './dashboard-filter.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';

/** Cron expression control module. */
@NgModule({
  declarations: [SafeDashboardFilterComponent],
  imports: [CommonModule, SafeButtonModule, SafeIconModule],
  exports: [SafeDashboardFilterComponent],
})
export class SafeDashboardFilterModule {}
