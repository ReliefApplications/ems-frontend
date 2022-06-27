import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppPreviewComponent } from './app-preview.component';

/** List of Application Preview routes */
const routes: Routes = [
  {
    path: '',
    component: AppPreviewComponent,
    children: [
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('./pages/form/form.module').then((m) => m.FormModule),
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
      },
      {
        path: 'settings',
        children: [
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
            loadChildren: () =>
              import('./pages/users/users.module').then((m) => m.UsersModule),
          },
        ],
      },
    ],
  },
];

/**
 * Routing Module of Application Preview toolbar.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppPreviewRoutingModule {}
