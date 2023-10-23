import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleSummaryComponent } from './role-summary.component';
import { SafeRoleSummaryModule } from '@oort-front/safe';
import { RoleSummaryRoutingModule } from './role-summary-routing.module';

/**
 * Role summary page module
 */
@NgModule({
  declarations: [RoleSummaryComponent],
  imports: [CommonModule, SafeRoleSummaryModule, RoleSummaryRoutingModule],
  exports: [RoleSummaryComponent],
})
export class RoleSummaryModule {}
