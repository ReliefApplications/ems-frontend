import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

/** Routes of workflow module for application preview */
const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('../form/form.module').then((m) => m.FormModule),
      },
    ],
  },
];

/**
 * Workflow routing module for application preview.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
