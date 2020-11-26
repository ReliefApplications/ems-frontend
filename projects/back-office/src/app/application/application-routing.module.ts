import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationComponent } from './application.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/home/home.module')
          .then(m => m.HomeModule),
        // canActivate: [WhoPermissionGuard]
      },
      {
        path: 'add-page',
        loadChildren: () => import('./pages/add-page/add-page.module')
          .then(m => m.AddPageModule),
        // canActivate: [WhoPermissionGuard]
      },
      {
        path: 'settings',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('./pages/settings/settings.module')
              .then(m => m.SettingsModule)
          },
          {
            path: 'roles',
            loadChildren: () => import('./pages/roles/roles.module')
              .then(m => m.RolesModule),
            // canActivate: [WhoPermissionGuard]
          },
          {
            path: 'users',
            loadChildren: () => import('./pages/users/users.module')
              .then(m => m.UsersModule),
            // canActivate: [WhoPermissionGuard]
          },
        ]
      },
      {
        path: 'dashboard/:id',
        loadChildren: () => import('../dashboard/pages/dashboard/dashboard.module')
          .then(m => m.DashboardModule),
        // canActivate: [WhoPermissionGuard]
      },
      {
        path: 'workflow/:id',
        loadChildren: () => import('./pages/workflow/workflow.module')
          .then(m => m.WorkflowModule),
        // canActivate: [WhoPermissionGuard]
      },
      {
        path: 'form/:id',
        loadChildren: () => import('./pages/form/form.module')
          .then(m => m.FormModule),
        // canActivate: [WhoPermissionGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
