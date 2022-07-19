import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';

/**
 * Routes available in the user component routing
 */
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

/**
 * Users routing module
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
