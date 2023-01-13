import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SafePermissionGuard } from '@safe/builder';
import { AccessGuard } from '../guards/access.guard';
import { DashboardComponent } from './dashboard.component';

/**
 * List of routes of the dashboard.
 * Uses lazy loading for performance.
 */
export const routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'share',
        children: [
          // Redirect to main page
          {
            path: '',
            redirectTo: '/',
            pathMatch: 'full',
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./pages/share/share.module').then((m) => m.ShareModule),
          },
        ],
      },
      {
        path: ':id',
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
            path: 'profile',
            loadChildren: () =>
              import('./pages/profile/profile.module').then(
                (m) => m.ProfileModule
              ),
          },
          {
            path: 'settings',
            children: [
              {
                path: 'templates',
                loadChildren: () =>
                  import('@safe/builder').then(
                    (m) => m.SafeApplicationTemplatesModule
                  ),
                canActivate: [SafePermissionGuard],
                data: {
                  permission: {
                    action: 'manage',
                    subject: 'Template',
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
                  permission: {
                    action: 'manage',
                    subject: 'DistributionList',
                  },
                },
              },
              {
                path: 'roles',
                children: [
                  {
                    path: '',
                    loadChildren: () =>
                      import('./pages/roles/roles.module').then(
                        (m) => m.RolesModule
                      ),
                    // canActivate: [SafePermissionGuard]
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
                    },
                    // canActivate: [SafePermissionGuard]
                  },
                ],
                canActivate: [SafePermissionGuard],
                data: {
                  breadcrumb: {
                    key: 'common.role.few',
                  },
                  permission: {
                    action: 'read',
                    subject: 'Role',
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
                    // canActivate: [SafePermissionGuard]
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
                    },
                    // canActivate: [SafePermissionGuard]
                  },
                ],
                canActivate: [SafePermissionGuard],
                data: {
                  breadcrumb: {
                    key: 'common.user.few',
                  },
                  permission: {
                    action: 'read',
                    subject: 'User',
                  },
                },
              },
              {
                path: '**',
              },
            ],
          },
        ],
      },
    ],
    canActivate: [AccessGuard],
  },
];

/**
 * Routing module of the Front-Office main navigation.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
