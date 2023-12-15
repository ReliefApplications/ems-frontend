import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppPreviewComponent } from './app-preview.component';

/** List of Application Preview routes */
const routes: Routes = [
  {
    path: '',
    component: AppPreviewComponent,
    children: [
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('./pages/form/form.module').then((m) => m.FormModule),
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
      },
      {
        path: 'settings',
        children: [
          {
            path: 'roles',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../shared/pages/roles/roles.module').then(
                    (m) => m.RolesModule
                  ),
                // canActivate: [PermissionGuard]
              },
              {
                path: ':id',
                loadChildren: () =>
                  import(
                    '../shared/pages/role-summary/role-summary.module'
                  ).then((m) => m.RoleSummaryModule),
                data: {
                  breadcrumb: {
                    alias: '@role',
                  },
                },
                // canActivate: [PermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.role.few',
              },
            },
          },
          {
            path: 'users',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('@oort-front/shared').then(
                    (m) => m.ApplicationUsersViewModule
                  ),
                // canActivate: [PermissionGuard]
              },
              {
                path: ':id',
                loadChildren: () =>
                  import(
                    '../shared/pages/user-summary/user-summary.module'
                  ).then((m) => m.UserSummaryModule),
                data: {
                  breadcrumb: {
                    alias: '@user',
                  },
                },
                // canActivate: [PermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.user.few',
              },
            },
          },
          {
            path: 'templates',
            loadChildren: () =>
              import('@oort-front/shared').then(
                (m) => m.ApplicationTemplatesViewModule
              ),
          },
          {
            path: 'distribution-lists',
            loadChildren: () =>
              import('@oort-front/shared').then(
                (m) => m.ApplicationDistributionListsViewModule
              ),
            // canActivate: [PermissionGuard]
          },
          {
            path: 'email-notifications',
            loadChildren: () =>
              import('@oort-front/shared').then((m) => m.EmailModule),
            // canActivate: [PermissionGuard]
          },
          {
            path: 'notifications',
            loadChildren: () =>
              import('@oort-front/shared').then(
                (m) => m.ApplicationNotificationsViewModule
              ),
            // canActivate: [PermissionGuard]
          },
        ],
      },
    ],
  },
];

/**
 * Routing Module of Application Preview toolbar.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPreviewRoutingModule {}
