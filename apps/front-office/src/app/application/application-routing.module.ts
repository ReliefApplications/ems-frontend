import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SafePermissionGuard } from '@oort-front/safe';
import { ApplicationComponent } from './application.component';

/**
 * List of routes of the application.
 * Uses lazy loading for performance.
 */
export const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
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
          import('@oort-front/safe').then((m) => m.SafeProfileViewModule),
      },
      {
        path: 'settings',
        children: [
          {
            path: 'templates',
            loadChildren: () =>
              import('@oort-front/safe').then(
                (m) => m.SafeApplicationTemplatesViewModule
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
              import('@oort-front/safe').then(
                (m) => m.SafeApplicationDistributionListsViewModule
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
            path: 'notifications',
            loadChildren: () =>
              import('@oort-front/safe').then(
                (m) => m.SafeApplicationNotificationsViewModule
              ),
            // canActivate: [SafePermissionGuard]
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
                  import('@oort-front/safe').then(
                    (m) => m.SafeApplicationUsersViewModule
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
        ],
      },
      // {
      //   path: 'share',
      //   children: [
      //     // Redirect to main page
      //     {
      //       path: '',
      //       redirectTo: '/',
      //       pathMatch: 'full',
      //     },
      //     {
      //       path: ':id',
      //       loadChildren: () =>
      //         import('./pages/share/share.module').then((m) => m.ShareModule),
      //     },
      //   ],
      // },
    ],
  },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
