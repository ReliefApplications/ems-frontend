import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/** List of dashboard routes. */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

/**
 * Application preview dashboard routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
