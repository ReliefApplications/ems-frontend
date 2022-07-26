import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormBuilderComponent } from './form-builder.component';
import { CanDeactivateGuard } from '../../../guards/can-deactivate.guard';

/** List of routes of form builder module */
const routes: Routes = [
  {
    path: '',
    component: FormBuilderComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

/**
 * Form builder routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CanDeactivateGuard],
  exports: [RouterModule],
})
export class FormBuilderRoutingModule {}
