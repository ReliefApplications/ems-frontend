import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeDashboardFilterComponent } from './dashboard-filter.component';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { SafeDrawerPositionerDirective } from './directives/drawer-positioner/drawer-positioner.directive';

/** Cron expression control module. */
@NgModule({
  declarations: [SafeDashboardFilterComponent, SafeDrawerPositionerDirective],
  imports: [
    CommonModule,
    SafeButtonModule,
    SafeIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  exports: [SafeDashboardFilterComponent],
  providers: [SafeDrawerPositionerDirective],
})
export class SafeDashboardFilterModule {}
