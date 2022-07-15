import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';

/**
 * Declaration of routes for roles component.
 */
const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
];

/**
 * Routing export for roles component.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
