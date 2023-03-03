import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PullJobsComponent } from './pull-jobs.component';

/** List of routes of Pull Jobs page module. */
const routes: Routes = [
  {
    path: '',
    component: PullJobsComponent,
  },
];

/** Pull jobs page routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PullJobsRoutingModule {}
