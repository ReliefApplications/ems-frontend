import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccessGuard } from './guards/access.guard';

// Common navigation parameters
const canActivate: any[] = [AccessGuard];
let initialNavigation: any;

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
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
      },
    ],
    canActivate,
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
      initialNavigation,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
