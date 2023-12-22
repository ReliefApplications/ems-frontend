import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';
import { IsNormalizeUrl } from '../../../guards/normalize-url.guard';

/**
 * List of routes of form page.
 */
const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    canActivate: [IsNormalizeUrl],
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
