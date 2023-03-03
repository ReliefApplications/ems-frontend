import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/** List of routes of dashboard module */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

/** Dashboard routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
