import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from './guards/access.guard';
import { AuthGuard } from './guards/auth.guard';

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    children: [
      {
        path: '',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./redirect/redirect.module').then(
                (m) => m.RedirectModule
              ),
            pathMatch: 'full',
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./application/application.module').then(
                (m) => m.ApplicationModule
              ),
          },
          {
            path: 'share/:id',
            loadChildren: () =>
              import('./application/pages/share/share.module').then(
                (m) => m.ShareModule
              ),
          },
        ],
        canActivate: [AccessGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
];

/**
 * Root module of Routing. Separate the front into two modules: 'auth' and 'dashboard'.
 * Use lazy loading for performance.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
