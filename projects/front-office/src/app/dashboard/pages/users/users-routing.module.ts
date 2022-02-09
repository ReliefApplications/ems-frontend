import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';

/** List of routes of Users page */
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

/**
 * Routing module of Users page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
