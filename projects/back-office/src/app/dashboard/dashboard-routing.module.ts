import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WhoPermissionGuard } from 'who-shared';
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
                children: [
                    {
                        path: 'forms',
                        loadChildren: () => import('./pages/forms/forms.module')
                            .then(m => m.FormsModule),
                        // canActivate: [WhoPermissionGuard]
                    },
                    {
                        path: 'resources',
                        loadChildren: () => import('./pages/resources/resources.module')
                            .then(m => m.ResourcesModule),
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
            },
            {
                path: '**',
                pathMatch: 'full',
                redirectTo: 'settings'
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
