import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkflowComponent } from './workflow.component';
import { SafePermissionGuard, CustomRoute } from '@safe/builder';

/** List of routes of application workflow module */
const routes: CustomRoute[] = [
  {
    path: '',
    component: WorkflowComponent,
    children: [
      {
        path: '',
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
        loadChildren: () =>
          import('../../../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../form/form.module').then((m) => m.FormModule),
            canActivate: [SafePermissionGuard],
            data: {
              permissions: {
                logic: 'and',
                permissions: ['read:forms'],
              },
            },
          },
          {
            path: 'builder/:id',
            loadChildren: () =>
              import(
                '../../../dashboard/pages/form-builder/form-builder.module'
              ).then((m) => m.FormBuilderModule),
            canActivate: [SafePermissionGuard],
            data: {
              permissions: {
                logic: 'and',
                permissions: ['manage:forms'],
              },
            },
          },
        ],
      },
    ],
  },
];

/**
 * Application workflow routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkflowRoutingModule {}
