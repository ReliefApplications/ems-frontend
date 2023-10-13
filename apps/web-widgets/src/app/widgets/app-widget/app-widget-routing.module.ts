import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * List of top level routes of the Front-Office.
 */
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class ApplicationWidgetRoutingModule {}
