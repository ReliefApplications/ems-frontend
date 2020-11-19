import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./components/home/home.module')
          .then(m => m.HomeModule),
      },
      {
        path: 'add-step',
        loadChildren: () => import('./components/add-step/add-step.module')
          .then(m => m.AddStepModule),
      },
      {
        path: 'dashboard/:id',
        loadChildren: () => import('../../../dashboard/pages/dashboard/dashboard.module')
          .then(m => m.DashboardModule),
      },
      {
        path: 'form/:id',
        loadChildren: () => import('../form/form.module')
          .then(m => m.FormModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkflowRoutingModule { }
