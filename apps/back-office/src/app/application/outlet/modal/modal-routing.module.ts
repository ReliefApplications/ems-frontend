import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ModalComponent } from './modal.component';

const routes: Routes = [
  {
    path: '',
    component: ModalComponent,
    children: [
      {
        path: 'form/:id',
        loadChildren: () =>
          import(
            '../../../dashboard/pages/form-builder/form-builder.module'
          ).then((m) => m.FormBuilderModule),
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../../pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalRoutingModule {}
