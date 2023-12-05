import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';

/**
 * List of routes of form page.
 */
const routes: Routes = [
  {
    path: '',
    component: FormComponent,
  },
];

/**
 * Routing module of form page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
