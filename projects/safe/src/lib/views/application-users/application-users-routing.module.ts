import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeApplicationUsersComponent } from './application-users.component';

/** List of routes of application users module */
const routes: Routes = [
  {
    path: '',
    component: SafeApplicationUsersComponent,
  },
];

/**
 * Application users routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafeApplicationUsersRoutingModule {}
