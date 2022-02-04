import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormBuilderComponent } from './form-builder.component';
import { CanDeactivateGuard } from '../../../guards/can-deactivate.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        alias: '@formBuilder',
      },
    },
    component: FormBuilderComponent,
    canDeactivate: [CanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CanDeactivateGuard],
  exports: [RouterModule],
})
export class FormBuilderRoutingModule {}
