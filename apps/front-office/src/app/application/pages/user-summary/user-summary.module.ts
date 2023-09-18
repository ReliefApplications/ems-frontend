import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryRoutingModule } from './user-summary-routing.module';
import { UserSummaryComponent } from './user-summary.component';
import { UserSummaryModule } from '@oort-front/shared';

/**
 * User Summary page module.
 */
@NgModule({
  declarations: [UserSummaryComponent],
  imports: [CommonModule, UserSummaryRoutingModule, UserSummaryModule],
  exports: [UserSummaryComponent],
})
export class UserSummaryModule {}
