import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/** Divide the dashboard module into three modules:
    * forms and resources
    * dashboards
    * users
    Use lazy loading for performance.
*/
export const routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'applications',
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'referencedata',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/reference-datas/reference-datas.module').then(
                (m) => m.ReferenceDatasModule
              ),
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./pages/reference-data/reference-data.module')
                .then()
                .then((m) => m.ReferenceDataModule),
          },
        ],
      },
      {
        path: 'forms',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/forms/forms.module').then((m) => m.FormsModule),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'records/:id',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('./pages/form-records/form-records.module').then(
                    (m) => m.FormRecordsModule
                  ),
              },
              {
                path: 'update/:id',
                loadChildren: () =>
                  import('./pages/update-record/update-record.module').then(
                    (m) => m.UpdateRecordModule
                  ),
                // canActivate: [SafePermissionGuard]
              },
            ],
          },
          {
            path: 'answer/:id',
            loadChildren: () =>
              import('./pages/form-answer/form-answer.module').then(
                (m) => m.FormAnswerModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder',
            loadChildren: () =>
              import('./pages/form-builder/form-builder.module').then(
                (m) => m.FormBuilderModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder/:id',
            loadChildren: () =>
              import('./pages/form-builder/form-builder.module').then(
                (m) => m.FormBuilderModule
              ),
            // canActivate: [SafePermissionGuard]
          },
        ],
      },
      {
        path: 'resources',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/resources/resources.module').then(
                (m) => m.ResourcesModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import('./pages/resource/resource.module').then(
                    (m) => m.ResourceModule
                  ),
              },
              {
                path: 'update/:id',
                loadChildren: () =>
                  import('./pages/update-record/update-record.module').then(
                    (m) => m.UpdateRecordModule
                  ),
                // canActivate: [SafePermissionGuard]
              },
            ],
          },
        ],
      },
      {
        path: 'dashboards',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/dashboards/dashboards.module').then(
                (m) => m.DashboardsModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: ':id',
            loadChildren: () =>
              import('./pages/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
            // canActivate: [SafePermissionGuard]
          },
        ],
      },
      {
        path: 'applications',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./pages/applications/applications.module').then(
                (m) => m.ApplicationsModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          // {
          //     path: ':id',
          //     loadChildren: () => import('../application/application.module')
          //         .then(m => m.ApplicationModule),
          //     // canActivate: [SafePermissionGuard]
          // }
        ],
      },
      {
        path: 'settings',
        children: [
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
            path: 'apiconfigurations',
            children: [
              {
                path: '',
                loadChildren: () =>
                  import(
                    './pages/api-configurations/api-configurations.module'
                  ).then((m) => m.ApiConfigurationsModule),
                // canActivate: [SafePermissionGuard]
              },
              {
                path: ':id',
                loadChildren: () =>
                  import(
                    './pages/api-configuration/api-configuration.module'
                  ).then((m) => m.ApiConfigurationModule),
                // canActivate: [SafePermissionGuard]
              },
            ],
          },
          {
            path: 'pulljobs',
            loadChildren: () =>
              import('./pages/pull-jobs/pull-jobs.module').then(
                (m) => m.PullJobsModule
              ),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: '**',
            pathMatch: 'full',
            redirectTo: 'users',
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
export class DashboardRoutingModule {}
