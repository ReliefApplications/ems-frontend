import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleSummaryComponent } from './role-summary.component';
import { RoleSummaryModule } from '@oort-front/shared';
import { RoleSummaryRoutingModule } from './role-summary-routing.module';

/**
 * Role summary page module
 */
@NgModule({
  declarations: [RoleSummaryComponent],
  imports: [CommonModule, RoleSummaryModule, RoleSummaryRoutingModule],
  exports: [RoleSummaryComponent],
})
export class RoleSummaryModule {}
