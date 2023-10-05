import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationDistributionListsComponent } from './application-distribution-lists.component';

/** List of routes of application distribution lists module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationDistributionListsComponent,
  },
];

/**
 * Application distribution lists routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationDistributionListsRoutingModule {}
