import { RouterModule, Routes } from '@angular/router';
import { RedirectComponent } from './redirect.component';
import { NgModule } from '@angular/core';

/**
 * Redirect page routing of front-office.
 */
export const routes: Routes = [
  {
    path: '',
    component: RedirectComponent,
  },
];

/**
 * Redirect page module of front-office.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RedirectRoutingModule {}
