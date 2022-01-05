import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { AccessGuard } from './guards/access.guard';

import { config, AuthenticationType } from '@safe/builder';

const canActivate: any[] = [AccessGuard];
let initialNavigation: any;
if (config.authenticationType === AuthenticationType.azureAD) {
  canActivate.push(MsalGuard);
  initialNavigation = !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabled' : 'disabled';
}

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./dashboard/dashboard.module')
    .then(m => m.DashboardModule),
    canActivate
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

/**
 * Root module of Routing. Separate the front into two modules: 'auth' and 'dashboard'.
 * Use lazy loading for performance.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes, {
    relativeLinkResolution: 'legacy',
    initialNavigation
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
