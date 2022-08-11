import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users.component';

/** Routes of Users module. */
const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
  },
];

/**
 * Users routing module for application preview.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
