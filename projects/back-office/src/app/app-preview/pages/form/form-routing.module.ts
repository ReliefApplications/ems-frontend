import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';

/** List of form routes */
const routes: Routes = [
  {
    path: '',
    component: FormComponent,
  },
];

/**
 * Application preview form routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
