import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

/**
 * List of top level routes of the public-forms.
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./no-form/no-form.module').then((m) => m.NoFormModule),
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadChildren: () => import('./form/form.module').then((m) => m.FormModule),
  },
];

/**
 * Root routing module of the public-forms application.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
