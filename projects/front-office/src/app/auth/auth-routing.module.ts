import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * List of routes of authentication module.
 * Only contains 'login' page.
 * All routes starting with '/auth' should redirect to 'login' page.
 */
export const routes = [
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
