import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WhoPermissionGuard } from '@who-ems/builder';
import { DashboardComponent } from './dashboard.component';

/*  Divide the dashboard module into three modules:
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
                redirectTo: 'applications'
            },
            {
                path: 'profile',
                loadChildren: () => import('./pages/profile/profile.module')
                    .then(m => m.ProfileModule),
            },
            {
                path: 'forms',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/forms/forms.module')
                            .then(m => m.FormsModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'records/:id',
                        loadChildren: () => import('./pages/form-records/form-records.module')
                            .then(m => m.FormRecordsModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'answer/:id',
                        loadChildren: () => import('./pages/form-answer/form-answer.module')
                            .then(m => m.FormAnswerModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'builder',
                        loadChildren: () => import('./pages/form-builder/form-builder.module')
                            .then(m => m.FormBuilderModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'builder/:id',
                        loadChildren: () => import('./pages/form-builder/form-builder.module')
                            .then(m => m.FormBuilderModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'update/:id',
                        loadChildren: () => import('./pages/update-record/update-record.module')
                            .then(m => m.UpdateRecordModule),
                        // canActivate: [WhoPermissionGuard]
                    }
                ]
            },
            {
                path: 'resources',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/resources/resources.module')
                            .then(m => m.ResourcesModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: ':id',
                        loadChildren: () => import('./pages/resource/resource.module')
                            .then(m => m.ResourceModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'update/:id',
                        loadChildren: () => import('./pages/update-record/update-record.module')
                            .then(m => m.UpdateRecordModule),
                        // canActivate: [WhoPermissionGuard]
                    }
                ]
            },
            {
                path: 'dashboards',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/dashboards/dashboards.module')
                            .then(m => m.DashboardsModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: ':id',
                        loadChildren: () => import('./pages/dashboard/dashboard.module')
                            .then(m => m.DashboardModule),
                        // canActivate: [WhoPermissionGuard]
                    }
                ]
            },
            {
                path: 'applications',
                children: [
                    {
                        path: '',
                        loadChildren: () => import('./pages/applications/applications.module')
                            .then(m => m.ApplicationsModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    // {
                    //     path: ':id',
                    //     loadChildren: () => import('../application/application.module')
                    //         .then(m => m.ApplicationModule),
                    //     // canActivate: [WhoPermissionGuard]
                    // }
                ]
            },
            {
                path: 'settings',
                children: [
                    {
                        path: 'users',
                        loadChildren: () => import('./pages/users/users.module')
                            .then(m => m.UsersModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'roles',
                        loadChildren: () => import('./pages/roles/roles.module')
                            .then(m => m.RolesModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: '**',
                        pathMatch: 'full',
                        redirectTo: 'users'
                    }
                ]
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
