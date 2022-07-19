import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

/**
 * Divide the dashboard module into three modules:
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
            data: {
              breadcrumb: {
                alias: '@referenceData',
              },
            },
          },
        ],
        data: {
          breadcrumb: {
            key: 'common.referenceData.few',
          },
        },
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
            path: ':id',
            children: [
              {
                path: '',
                redirectTo: 'answer',
              },
              {
                path: 'builder',
                loadChildren: () =>
                  import('./pages/form-builder/form-builder.module').then(
                    (m) => m.FormBuilderModule
                  ),
                data: {
                  breadcrumb: {
                    key: 'common.edit',
                  },
                },
              },
              {
                path: 'answer',
                loadChildren: () =>
                  import('./pages/form-answer/form-answer.module').then(
                    (m) => m.FormAnswerModule
                  ),
                data: {
                  breadcrumb: {
                    key: 'common.add',
                  },
                },
                // canActivate: [SafePermissionGuard]
              },
              {
                path: 'records',
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
                    data: {
                      breadcrumb: {
                        alias: '@record',
                      },
                    },
                    // canActivate: [SafePermissionGuard]
                  },
                ],
                data: {
                  breadcrumb: {
                    key: 'common.record.few',
                  },
                },
              },
            ],
            data: {
              breadcrumb: {
                alias: '@form',
              },
            },
          },
          // {
          //   path: 'builder',
          //   loadChildren: () =>
          //     import('./pages/form-builder/form-builder.module').then(
          //       (m) => m.FormBuilderModule
          //     ),
          //   // canActivate: [SafePermissionGuard]
          // },
        ],
        data: {
          breadcrumb: {
            key: 'common.form.few',
          },
        },
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
            loadChildren: () =>
              import('./pages/resource/resource.module').then(
                (m) => m.ResourceModule
              ),
            children: [
              {
                path: '',
                redirectTo: 'records',
              },
              {
                path: 'records',
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
                    data: {
                      breadcrumb: {
                        alias: '@record',
                      },
                    },
                    // canActivate: [SafePermissionGuard]
                  },
                ],
                data: {
                  breadcrumb: {
                    key: 'common.record.few',
                  },
                },
              },
              {
                path: 'forms',
                children: [
                  {
                    path: '',
                    loadChildren: () =>
                      import('./pages/resource/resource.module').then(
                        (m) => m.ResourceModule
                      ),
                  },
                  {
                    path: ':id',
                    children: [
                      {
                        path: '',
                        redirectTo: 'answer',
                      },
                      {
                        path: 'builder',
                        loadChildren: () =>
                          import(
                            './pages/form-builder/form-builder.module'
                          ).then((m) => m.FormBuilderModule),
                        data: {
                          breadcrumb: {
                            key: 'common.edit',
                          },
                        },
                      },
                      {
                        path: 'answer',
                        loadChildren: () =>
                          import('./pages/form-answer/form-answer.module').then(
                            (m) => m.FormAnswerModule
                          ),
                        data: {
                          breadcrumb: {
                            key: 'common.add',
                          },
                        },
                        // canActivate: [SafePermissionGuard]
                      },
                    ],
                    data: {
                      breadcrumb: {
                        alias: '@form',
                      },
                    },
                  },
                ],
                data: {
                  breadcrumb: {
                    key: 'common.form.few',
                  },
                },
              },
              {
                path: 'layouts',
                loadChildren: () =>
                  import('./pages/resource/resource.module').then(
                    (m) => m.ResourceModule
                  ),
                // canActivate: [SafePermissionGuard]
                data: {
                  breadcrumb: {
                    key: 'common.layout.few',
                  },
                },
              },
            ],
            data: {
              breadcrumb: {
                alias: '@resource',
              },
            },
          },
        ],
        data: {
          breadcrumb: {
            key: 'common.resource.few',
          },
        },
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
                data: {
                  breadcrumb: {
                    alias: '@user',
                  },
                },
                // canActivate: [SafePermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.user.few',
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
            data: {
              breadcrumb: {
                key: 'common.role.few',
              },
            },
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
                data: {
                  breadcrumb: {
                    alias: '@api',
                  },
                },
                // canActivate: [SafePermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.apiConfiguration.few',
              },
            },
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
/**
 *
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
