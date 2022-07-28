import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';

/** List of Login module routes. */
const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

/** Login routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
