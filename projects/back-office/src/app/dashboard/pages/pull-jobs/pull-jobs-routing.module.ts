import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PullJobsComponent } from './pull-jobs.component';

/**
 * Routes available in the routing
 */
const routes: Routes = [
  {
    path: '',
    component: PullJobsComponent,
  },
];

/**
 * Pulljob routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PullJobsRoutingModule {}
