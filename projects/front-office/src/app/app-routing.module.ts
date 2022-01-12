import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MsalGuard } from '@azure/msal-angular';
import { BrowserUtils } from '@azure/msal-browser';
import { AccessGuard } from './guards/access.guard';

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        loadChildren: () => import('./dashboard/dashboard.module')
          .then(m => m.DashboardModule),
      },
      {
        path: ':appId',
        children: [
          {
            path: '',
            loadChildren: () => import('./dashboard/dashboard.module')
              .then(m => m.DashboardModule),
          },
          {
            path: ':typePage',
            children: [
              {
                path: ':idPage',
                loadChildren: () => import('./dashboard/dashboard.module')
                  .then(m => m.DashboardModule),
              }
            ],
          },
        ],
      }
    ],
    canActivate: [MsalGuard, AccessGuard],
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
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabled' : 'disabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
