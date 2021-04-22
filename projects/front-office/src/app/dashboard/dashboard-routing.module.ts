import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
                path: 'dashboard/:id',
                loadChildren: () => import('./pages/dashboard/dashboard.module')
                    .then(m => m.DashboardModule),
            },
            {
                path: 'form/:id',
                loadChildren: () => import('./pages/form/form.module')
                    .then(m => m.FormModule),
            },
            {
                path: 'workflow/:id',
                loadChildren: () => import('./pages/workflow/workflow.module')
                    .then(m => m.WorkflowModule),
            },
            {
                path: 'settings',
                children: [
                  {
                    path: 'roles',
                    loadChildren: () => import('./pages/roles/roles.module')
                      .then(m => m.RolesModule),
                    // canActivate: [SafePermissionGuard]
                  },
                  {
                    path: 'users',
                    loadChildren: () => import('./pages/users/users.module')
                      .then(m => m.UsersModule),
                    // canActivate: [SafePermissionGuard]
                  },
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
