import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryRoutingModule } from './user-summary-routing.module';
import { UserSummaryComponent } from './user-summary.component';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { UserSummaryModule as SharedUserSummaryModule } from '@oort-front/shared';

/**
 * User Summary page module.
 */
@NgModule({
  declarations: [UserSummaryComponent],
  imports: [CommonModule, UserSummaryRoutingModule, SharedUserSummaryModule],
  exports: [UserSummaryComponent],
})
export class UserSummaryModule {}
