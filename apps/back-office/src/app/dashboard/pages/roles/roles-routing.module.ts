import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesComponent } from './roles.component';

/** List of routes of roles page module */
const routes: Routes = [
  {
    path: '',
    component: RolesComponent,
  },
];

/** Roles page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
