import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

/** List of routes of workflow page */
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
        data: {
          breadcrumb: {
            alias: '@workflow',
          },
        },
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('../form/form.module').then((m) => m.FormModule),
        data: {
          breadcrumb: {
            alias: '@workflow',
          },
        },
      },
    ],
  },
];

/**
 * Routing module of Workflow page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
