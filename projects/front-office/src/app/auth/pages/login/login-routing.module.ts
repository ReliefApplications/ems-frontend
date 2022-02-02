import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

/**
 * List of routes of Login Module.
 */
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

/**
 * Routing module of Login Module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
