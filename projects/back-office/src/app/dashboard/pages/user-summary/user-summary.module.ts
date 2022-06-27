import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserSummaryRoutingModule } from './user-summary-routing.module';
import { UserSummaryComponent } from './user-summary.component';
import { SafeUserSummaryModule } from '@safe/builder';

/**
 * User Summary page module.
 */
@NgModule({
  declarations: [UserSummaryComponent],
  imports: [CommonModule, UserSummaryRoutingModule, SafeUserSummaryModule],
  exports: [UserSummaryComponent],
})
export class UserSummaryModule {}
