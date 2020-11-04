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
                path: 'settings',
                children: [
                    {
                        path: 'users',
                        loadChildren: () => import('./pages/users/users.module')
                            .then(m => m.UsersModule),
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
