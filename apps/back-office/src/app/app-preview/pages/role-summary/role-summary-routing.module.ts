import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleSummaryComponent } from './role-summary.component';

/** List of routes of role summary. */
const routes: Routes = [
  {
    path: '',
    component: RoleSummaryComponent,
  },
];

/**
 * Role Summary page routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleSummaryRoutingModule {}
