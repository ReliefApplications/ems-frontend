import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSummaryComponent } from './user-summary.component';
import { IsNormalizeUrl } from '../../../guards/normalize-url.guard';

/** List of routes of user summary. */
const routes: Routes = [
  {
    path: '',
    component: UserSummaryComponent,
    canActivate: [IsNormalizeUrl],
  },
];

/**
 * User Summary page routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSummaryRoutingModule {}
