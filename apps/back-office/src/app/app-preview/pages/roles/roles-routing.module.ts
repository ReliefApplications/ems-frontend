import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';

/** List of routes of roles */
const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
];

/**
 * Application preview roles page routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
