import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: ':id',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

/**
 * Root module of Routing. Separate the front into two modules: 'auth' and 'dashboard'.
 * Use lazy loading for performance.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {}),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
