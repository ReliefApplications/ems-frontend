import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';

/**
 * Available routes for roles module
 */
const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
];

/**
 * Roles routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
