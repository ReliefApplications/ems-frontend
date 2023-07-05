import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormComponent } from './form.component';

/** List of routes of form component. */
const routes: Routes = [
  {
    path: '',
    component: FormComponent,
    children: [
      {
        path: 'builder',
        outlet: 'modal',
        loadChildren: () =>
          import('../../outlet/modal/modal.module').then((m) => m.ModalModule),
      },
    ],
  },
];

/** Form routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRoutingModule {}
