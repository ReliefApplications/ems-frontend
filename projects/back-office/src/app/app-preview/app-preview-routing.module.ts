import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppPreviewComponent } from './app-preview.component';
import { SafePermissionGuard, CustomRoute } from '@safe/builder';
/** List of Application Preview routes */
const routes: CustomRoute[] = [
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
                  import('./pages/roles/roles.module').then(
                    (m) => m.RolesModule
                  ),
                canActivate: [SafePermissionGuard],
                data: {
                  permissions: {
                    logic: 'and',
                    permissions: ['read:roles'],
                  },
                },
              },
              {
                path: ':id',
                loadChildren: () =>
                  import('./pages/role-summary/role-summary.module').then(
                    (m) => m.RoleSummaryModule
                  ),
                data: {
                  breadcrumb: {
                    alias: '@role',
                  },
                  permissions: {
                    logic: 'and',
                    permissions: ['read:roles'],
                  },
                },
                canActivate: [SafePermissionGuard],
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
                  import('./pages/users/users.module').then(
                    (m) => m.UsersModule
                  ),
                canActivate: [SafePermissionGuard],
                data: {
                  permissions: {
                    logic: 'and',
                    permissions: ['read:users'],
                  },
                },
              },
              {
                path: ':id',
                loadChildren: () =>
                  import('./pages/user-summary/user-summary.module').then(
                    (m) => m.UserSummaryModule
                  ),
                data: {
                  breadcrumb: {
                    alias: '@user',
                  },
                  permissions: {
                    logic: 'and',
                    permissions: ['manage:users'],
                  },
                },
                canActivate: [SafePermissionGuard],
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
              import('@safe/builder').then(
                (m) => m.SafeApplicationTemplatesModule
              ),
            canActivate: [SafePermissionGuard],
            data: {
              permissions: {
                logic: 'and',
                permissions: ['manage:templates'],
              },
            },
          },
          {
            path: 'distribution-lists',
            loadChildren: () =>
              import('@safe/builder').then(
                (m) => m.SafeApplicationDistributionListsModule
              ),
            canActivate: [SafePermissionGuard],
            data: {
              permissions: {
                logic: 'and',
                permissions: ['manage:distribution_lists'],
              },
            },
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
