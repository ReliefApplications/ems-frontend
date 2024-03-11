import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsDeactivated } from '../../../guards/can-deactivate.guard';
import { DashboardComponent } from './dashboard.component';
import { IsNormalizeUrl } from '../../../guards/normalize-url.guard';

/**
 * List of routes of Dashboard page.
 */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canDeactivate: [IsDeactivated],
    canActivate: [IsNormalizeUrl],
    data: {
      reuse: true,
    },
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
