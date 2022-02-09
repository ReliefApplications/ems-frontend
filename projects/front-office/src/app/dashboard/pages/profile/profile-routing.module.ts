import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';

/** List of routes of Profile page */
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
];

/**
 * Routing module of profile page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
