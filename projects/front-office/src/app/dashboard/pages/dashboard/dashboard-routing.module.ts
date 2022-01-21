import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/**
 * List of routes of Dashboard page.
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

/**
 * Routing Module of dashboard page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
