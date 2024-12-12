/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../guards/can-deactivate.guard';
import { ApplicationComponent } from './application.component';
import { PermissionGuard } from '@oort-front/shared';
// import { ActivityLogModule } from './pages/activity-log/activity-log.module';
// import { ActivityLogComponent } from './pages/activity-log/activity-log.component';
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
            data: {
              breadcrumb: {
                key: 'common.settings',
              },
            },
          },
          {
            path: 'roles',
            data: {
              breadcrumb: {
                key: 'common.role.few',
              },
            },
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('../shared/pages/roles/roles.module').then(
                    (m) => m.RolesModule
                  ),
                data: {
                  inApplication: true,
                },

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
          },
          {
            path: 'users',
            data: {
              breadcrumb: {
                key: 'common.user.few',
              },
            },
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
          },
          {
            path: 'position',
            data: {
              breadcrumb: {
                key: 'common.attribute.few',
              },
            },
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
          },
          {
            path: 'channels',
            loadChildren: () =>
              import('./pages/channels/channels.module').then(
                (m) => m.ChannelsModule
              ),
            data: {
              breadcrumb: {
                key: 'common.channel.few',
              },
            },
            // canActivate: [PermissionGuard]
          },
          {
            path: 'subscriptions',
            loadChildren: () =>
              import('./pages/subscriptions/subscriptions.module').then(
                (m) => m.SubscriptionsModule
              ),
            data: {
              breadcrumb: {
                key: 'common.subscription.few',
              },
            },
            // canActivate: [PermissionGuard]
          },
          {
            path: 'email-notifications',
            loadChildren: () =>
              import('@oort-front/shared').then((m) => m.EmailModule),
            data: {
              breadcrumb: {
                key: 'common.email.notification.few',
              },
            },
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
          {
            path: 'activity-log',
            loadChildren: () =>
              import('./pages/activity-log/activity-log.module').then(
                (m) => m.ActivityLogModule
              ),
            data: {
              breadcrumb: {
                key: 'common.activity.few',
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
        data: {
          breadcrumb: {
            alias: '@dashboard',
          },
        },
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
        data: {
          breadcrumb: {
            alias: '@form',
          },
        },
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
