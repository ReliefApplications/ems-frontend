import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { CanDeactivateGuard } from '../../guards/can-deactivate.guard';

/**
 * List of routes of Dashboard page.
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

/**
 * Routing Module of dashboard page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class DashboardRoutingModule {}
