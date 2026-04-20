import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoFormComponent } from './no-form/no-form.component';
import { FormComponent } from './form/form.component';
import { NoFormModule } from './no-form/no-form.module';
import { FormModule } from './form/form.module';

/**
 * List of top level routes of the public-forms.
 */
const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./no-form/no-form.module').then(
        (m) => m.NoFormModule
      ),
    // component: NoFormModule,
    pathMatch: 'full',
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./form/form.module').then(
        (m) => m.FormModule
      ),
    // component: FormModule,
  },
  //   children: [
  //     {
  //       path: '',
  //       loadChildren: () =>
  //         import('./no-form/no-form.module').then(
  //           (m) => m.NoFormModule
  //         ),
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: ':id',
  //       loadChildren: () =>
  //         import('./form/form.module').then(
  //           (m) => m.FormModule
  //         ),
  //     },
  //   ]
  // },
  // {
  //   path: '**',
  //   redirectTo: '',
  //   pathMatch: 'full',
  // },
];

/**
 * 
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
