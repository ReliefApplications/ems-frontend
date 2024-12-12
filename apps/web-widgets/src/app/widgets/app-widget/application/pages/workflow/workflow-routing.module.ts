import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { IsNormalizeUrl } from '../../../guards/normalize-url.guard';

/** List of routes of workflow page */
const routes: Routes = [
  {
    path: '',
    component: WorkflowComponent,
    canActivate: [IsNormalizeUrl],
    children: [
      {
        path: 'dashboard/:id',
        data: {
          breadcrumb: {
            alias: '@workflow',
          },
        },
        loadChildren: () =>
          import('../dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        data: {
          breadcrumb: {
            alias: '@workflow',
          },
        },
        loadChildren: () =>
          import('../form/form.module').then((m) => m.FormModule),
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
