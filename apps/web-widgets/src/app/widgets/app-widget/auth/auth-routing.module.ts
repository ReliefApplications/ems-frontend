import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * List of routes of authentication module.
 * Only contains 'login' page.
 * All routes starting with '/auth' should redirect to 'login' page.
 */
export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'login',
        redirectTo: '',
        pathMatch: 'full',
      },
      {
        path: 'error',
        loadChildren: () =>
          import('./pages/error/error.module').then((m) => m.ErrorModule),
      },
    ],
  },
];

/**
 * Routing module of Authentication module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
