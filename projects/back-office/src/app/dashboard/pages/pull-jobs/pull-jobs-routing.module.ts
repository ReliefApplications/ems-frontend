import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PullJobsComponent } from './pull-jobs.component';

const routes: Routes = [
  {
    path: '',
    component: PullJobsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PullJobsRoutingModule {}
