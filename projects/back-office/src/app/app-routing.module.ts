import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from './guards/access.guard';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AccessGuard],
      },
      {
        path: 'applications',
        children: [
          {
            path: ':id',
            data: {
              breadcrumb: {
                skip: true,
              },
            },
            loadChildren: () =>
              import('./application/application.module').then(
                (m) => m.ApplicationModule
              ),
          },
        ],
        canActivate: [AccessGuard],
        data: {
          breadcrumb: {
            name: 'Applications',
          },
        },
      },
      {
        path: 'app-preview',
        children: [
          {
            path: ':id',
            loadChildren: () =>
              import('./app-preview/app-preview.module').then(
                (m) => m.AppPreviewModule
              ),
          },
        ],
        canActivate: [AccessGuard],
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '**',
    redirectTo: 'applications',
    pathMatch: 'full',
  },
];

/*  Root module of Routing. Separate the front into three modules: 'auth', 'dashboard' and 'application'.
    Use lazy loading for performance.
*/
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      relativeLinkResolution: 'legacy',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
