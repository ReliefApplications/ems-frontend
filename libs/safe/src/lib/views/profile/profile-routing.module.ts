import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SafeProfileComponent } from './profile.component';

/** List of routes of profile view module */
const routes: Routes = [
  {
    path: '',
    component: SafeProfileComponent,
  },
];

/**
 * Profile view routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafeProfileRoutingModule {}
