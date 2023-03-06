import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeApplicationDistributionListsComponent } from './application-distribution-lists.component';

/** List of routes of application distribution lists module */
const routes: Routes = [
  {
    path: '',
    component: SafeApplicationDistributionListsComponent,
  },
];

/**
 * Application distribution lists routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafeApplicationDistributionListsRoutingModule {}
