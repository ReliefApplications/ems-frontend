import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        alias: '@workflow',
      },
    },
    component: WorkflowComponent,
    children: [
      {
        path: '',
        data: {
          breadcrumb: {
            skip: true,
          },
        },
        loadChildren: () =>
          import('./components/home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'add-step',
        loadChildren: () =>
          import('./components/add-step/add-step.module').then(
            (m) => m.AddStepModule
          ),
      },
      {
        path: 'dashboard/:id',
        data: {
          breadcrumb: {
            alias: '@dashboard',
          },
        },
        loadChildren: () =>
          import('../../../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        data: {
          breadcrumb: {
            alias: '@form',
          },
        },
        children: [
          {
            path: '',
            data: {
              breadcrumb: {
                skip: true,
              },
            },
            loadChildren: () =>
              import('../form/form.module').then((m) => m.FormModule),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder/:id',
            data: {
              breadcrumb: {
                skip: true,
              },
            },
            loadChildren: () =>
              import(
                '../../../dashboard/pages/form-builder/form-builder.module'
              ).then((m) => m.FormBuilderModule),
            // canActivate: [SafePermissionGuard]
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
