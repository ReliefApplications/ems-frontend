import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from './guards/access.guard';
import { AuthGuard } from './guards/auth.guard';

/**
 * List of top level routes of the Back-Office.
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
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AccessGuard],
      },
      {
        path: 'applications',
        children: [
          {
            path: ':id',
            loadChildren: () =>
              import('./application/application.module').then(
                (m) => m.ApplicationModule
              ),
          },
        ],
        canActivate: [AccessGuard],
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
    path: '**',
    redirectTo: 'applications',
    pathMatch: 'full',
  },
];

/**
 * Root module of Routing. Separate the front into three modules: 'auth', 'dashboard' and 'application'.
 * Use lazy loading for performance.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
