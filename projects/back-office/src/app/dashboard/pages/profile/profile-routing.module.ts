import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';

/** List of routes of profile page module */
const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
  },
];

/** Profile page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
