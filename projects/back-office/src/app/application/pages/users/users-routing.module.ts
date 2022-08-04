import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';

/** List of routes of application users module */
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

/**
 * Application users routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
