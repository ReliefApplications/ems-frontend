import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

/** Routes of application module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/home/home.module').then((m) => m.HomeModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'add-page',
        loadChildren: () =>
          import('./pages/add-page/add-page.module').then(
            (m) => m.AddPageModule
          ),
        // canActivate: [SafePermissionGuard]
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
                // canActivate: [SafePermissionGuard]
              },
            ],
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
                // canActivate: [SafePermissionGuard]
              },
            ],
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
                // canActivate: [SafePermissionGuard]
              },
              {
                path: ':id',
                loadChildren: () =>
                  import(
                    './pages/position-attributes/position-attributes.module'
                  ).then((m) => m.PositionAttributesModule),
                // canActivate: [SafePermissionGuard]
              },
            ],
          },
          {
            path: 'channels',
            loadChildren: () =>
              import('./pages/channels/channels.module').then(
                (m) => m.ChannelsModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'subscriptions',
            loadChildren: () =>
              import('./pages/subscriptions/subscriptions.module').then(
                (m) => m.SubscriptionsModule
              ),
            // canActivate: [SafePermissionGuard]
          },
        ],
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'form/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/form/form.module').then((m) => m.FormModule),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder/:id',
            loadChildren: () =>
              import(
                '../dashboard/pages/form-builder/form-builder.module'
              ).then((m) => m.FormBuilderModule),
            // canActivate: [SafePermissionGuard]
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
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
