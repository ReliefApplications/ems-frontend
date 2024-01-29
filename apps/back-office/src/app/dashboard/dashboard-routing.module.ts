import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PermissionGuard } from '@oort-front/shared';

/**
 * Divide the dashboard module into three modules:
 * forms and resources
 * dashboards
 * users
  Use lazy loading for performance.
 */
export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        redirectTo: 'applications',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('@oort-front/shared').then((m) => m.ProfileViewModule),
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
            // canActivate: [PermissionGuard]
          },
          {
            path: ':id',
            children: [
              {
                path: '',
                redirectTo: 'answer',
                pathMatch: 'full',
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
                // canActivate: [PermissionGuard]
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
                    // canActivate: [PermissionGuard]
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
          //   // canActivate: [PermissionGuard]
          // },
        ],
        data: {
          breadcrumb: {
            key: 'common.form.few',
          },
          permission: {
            action: 'read',
            subject: 'Form',
          },
        },
        canActivate: [PermissionGuard],
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
            // canActivate: [PermissionGuard]
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
                path: 'records',
                children: [
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
                    // canActivate: [PermissionGuard]
                  },
                ],
              },
              {
                path: 'forms',
                children: [
                  {
                    path: ':id',
                    children: [
                      {
                        path: '',
                        redirectTo: 'answer',
                        pathMatch: 'full',
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
                data: {
                  breadcrumb: {
                    key: 'common.form.few',
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
          permission: {
            action: 'read',
            subject: 'Resource',
          },
        },
        canActivate: [PermissionGuard],
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
            // canActivate: [PermissionGuard]
          },
          // {
          //     path: ':id',
          //     loadChildren: () => import('../application/application.module')
          //         .then(m => m.ApplicationModule),
          //     // canActivate: [PermissionGuard]
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
              permission: {
                action: 'read',
                subject: 'User',
              },
            },
            canActivate: [PermissionGuard],
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
              permission: {
                action: 'read',
                subject: 'Role',
              },
            },
            canActivate: [PermissionGuard],
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
                // canActivate: [PermissionGuard]
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
                // canActivate: [PermissionGuard]
              },
            ],
            data: {
              breadcrumb: {
                key: 'common.apiConfiguration.few',
              },
              permission: {
                action: 'read',
                subject: 'ApiConfiguration',
              },
            },
            canActivate: [PermissionGuard],
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
 * MAIN BO Dashboard routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
