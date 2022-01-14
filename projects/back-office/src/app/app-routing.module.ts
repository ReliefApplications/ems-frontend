import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { AccessGuard } from './guards/access.guard';
import { config, AuthenticationType } from '@safe/builder';
import { environment } from '../environments/environment';

// Common navigation parameters
const canActivate: any[] = [AccessGuard];
let initialNavigation: any;

// if Azure authentication, add more parameters to the navigation
if (environment.authenticationType === AuthenticationType.azureAD) {
  canActivate.push(MsalGuard);
  initialNavigation =
    !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup()
      ? 'enabled'
      : 'disabled';
}

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
