import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WhoPermissionGuard } from '@who-ems';
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
                loadChildren: () => import('./pages/dashboard/dashboard.module')
                    .then(m => m.DashboardModule),
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
