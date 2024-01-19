import { NgModule } from '@angular/core';
import {
  PreloadAllModules,
  RouteReuseStrategy,
  RouterModule,
  Routes,
} from '@angular/router';
import { IsNormalizeUrl } from './guards/normalize-url.guard';
import { AppRouteReuseStrategy } from './route-reuse-strategy';

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./application/application.module').then(
        (m) => m.ApplicationModule
      ),
    canActivate: [IsNormalizeUrl],
  },
  // {
  //   path: '**',
  //   redirectTo: '/',
  //   pathMatch: 'full',
  // },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: AppRouteReuseStrategy,
    },
  ],
})
export class ApplicationWidgetRoutingModule {}
