/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { ApplicationComponent } from './application.component';
import { PermissionGuard } from '@oort-front/shared';

/** Routes of application module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    canDeactivate: [CanDeactivateGuard],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        // canActivate: [PermissionGuard]
      },
      {
        path: 'add-page',
        loadChildren: () =>
          import('./pages/add-page/add-page.module').then(
            (m) => m.AddPageModule
          ),
        // canActivate: [PermissionGuard]
      },
      {
        path: 'settings',
        children: [
          {
            path: 'edit',
            loadChildren: () =>
              import('./pages/settings/settings.module').then(
                (m) => m.SettingsModule
              ),
          },
          {
            path: 'roles',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../shared/pages/roles/roles.module').then(
                    (m) => m.RolesModule
                  ),
                data: { inApplication: true },
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
            path: 'position',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('./pages/position/position.module').then(
                    (m) => m.PositionModule
                  ),
                // canActivate: [PermissionGuard]
              },
              {
                path: ':id',
                loadChildren: () =>
                  import(
                    './pages/position-attributes/position-attributes.module'
                  ).then((m) => m.PositionAttributesModule),
                data: {
                  breadcrumb: {
                    alias: '@attribute',
                  },
                },
                // canActivate: [PermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.attribute.few',
              },
            },
          },
          {
            path: 'channels',
            loadChildren: () =>
              import('./pages/channels/channels.module').then(
                (m) => m.ChannelsModule
              ),
            // canActivate: [PermissionGuard]
          },
          {
            path: 'subscriptions',
            loadChildren: () =>
              import('./pages/subscriptions/subscriptions.module').then(
                (m) => m.SubscriptionsModule
              ),
            // canActivate: [PermissionGuard]
          },
          {
            path: 'templates',
            loadChildren: () =>
              import('@oort-front/shared').then(
                (m) => m.ApplicationTemplatesViewModule
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
            path: 'distribution-lists',
            loadChildren: () =>
              import('@oort-front/shared').then(
                (m) => m.ApplicationDistributionListsViewModule
              ),
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
          {
            path: 'archive',
            loadChildren: () =>
              import('./pages/archive/archive.module').then(
                (m) => m.ArchiveModule
              ),
            canActivate: [PermissionGuard],
            data: {
              breadcrumb: {
                key: 'common.archive.few',
              },
            },
          },
        ],
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canActivate: [PermissionGuard]
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
        // canActivate: [PermissionGuard]
      },
      {
        path: 'form/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/form/form.module').then((m) => m.FormModule),
            // canActivate: [PermissionGuard]
          },
          {
            path: 'builder/:id',
            loadChildren: () =>
              import(
                '../dashboard/pages/form-builder/form-builder.module'
              ).then((m) => m.FormBuilderModule),
            // canActivate: [PermissionGuard]
          },
        ],
      },
    ],
  },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [CanDeactivateGuard],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
