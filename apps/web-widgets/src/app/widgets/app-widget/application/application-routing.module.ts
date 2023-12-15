import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { PermissionGuard } from '@oort-front/shared';
import { AccessGuard } from '../guards/access.guard';
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
        canActivate: [AccessGuard],
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('./pages/form/form.module').then((m) => m.FormModule),
        canActivate: [AccessGuard],
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
        canActivate: [AccessGuard],
      },
    ],
  },

  // {
  //   path: 'profile',
  //   loadChildren: () =>
  //     import('@oort-front/shared').then((m) => m.ProfileViewModule),
  //   canActivate: [AccessGuard],
  // },
  // {
  //   path: 'settings',
  //   children: [
  //     {
  //       path: 'templates',
  //       loadChildren: () =>
  //         import('@oort-front/shared').then(
  //           (m) => m.ApplicationTemplatesViewModule
  //         ),
  //       canActivate: [PermissionGuard],
  //       data: {
  //         permission: {
  //           action: 'manage',
  //           subject: 'Template',
  //         },
  //       },
  //     },
  //     {
  //       path: 'distribution-lists',
  //       loadChildren: () =>
  //         import('@oort-front/shared').then(
  //           (m) => m.ApplicationDistributionListsViewModule
  //         ),
  //       canActivate: [PermissionGuard],
  //       data: {
  //         permission: {
  //           action: 'manage',
  //           subject: 'DistributionList',
  //         },
  //       },
  //     },
  //     {
  //       path: 'notifications',
  //       loadChildren: () =>
  //         import('@oort-front/shared').then(
  //           (m) => m.ApplicationNotificationsViewModule
  //         ),
  //       // canActivate: [PermissionGuard]
  //     },
  //     {
  //       path: 'roles',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () =>
  //             import('./pages/roles/roles.module').then((m) => m.RolesModule),
  //           // canActivate: [PermissionGuard]
  //         },
  //         {
  //           path: ':id',
  //           loadChildren: () =>
  //             import('./pages/role-summary/role-summary.module').then(
  //               (m) => m.RoleSummaryModule
  //             ),
  //           data: {
  //             breadcrumb: {
  //               alias: '@role',
  //             },
  //           },
  //           // canActivate: [PermissionGuard]
  //         },
  //       ],
  //       canActivate: [PermissionGuard],
  //       data: {
  //         breadcrumb: {
  //           key: 'common.role.few',
  //         },
  //         permission: {
  //           action: 'read',
  //           subject: 'Role',
  //         },
  //       },
  //     },
  //     {
  //       path: 'users',
  //       children: [
  //         {
  //           path: '',
  //           loadChildren: () =>
  //             import('@oort-front/shared').then(
  //               (m) => m.ApplicationUsersViewModule
  //             ),
  //           // canActivate: [PermissionGuard]
  //         },
  //         {
  //           path: ':id',
  //           loadChildren: () =>
  //             import('./pages/user-summary/user-summary.module').then(
  //               (m) => m.UserSummaryModule
  //             ),
  //           data: {
  //             breadcrumb: {
  //               alias: '@user',
  //             },
  //           },
  //           // canActivate: [PermissionGuard]
  //         },
  //       ],
  //       canActivate: [PermissionGuard],
  //       data: {
  //         breadcrumb: {
  //           key: 'common.user.few',
  //         },
  //         permission: {
  //           action: 'read',
  //           subject: 'User',
  //         },
  //       },
  //     },
  //   ],
  // },
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
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
