import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module')
    .then(m => m.DashboardModule),
    canActivate: [MsalGuard]
  },
  {
    path: 'applications',
    children: [
      {
        path: ':id',
        loadChildren: () => import('./application/application.module')
          .then(m => m.ApplicationModule),
      }
    ],
    canActivate: [MsalGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module')
      .then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

/*  Root module of Routing. Separate the front into three modules: 'auth', 'dashboard' and 'application'.
    Use lazy loading for performance.
*/
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
