import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
/**
 * Routes available for the profile component
 */
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
];

/**
 * Routing module for the profile component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
