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
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'add-page',
        loadChildren: () => import('./pages/add-page/add-page.module')
          .then(m => m.AddPageModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'settings',
        children: [
          {
            path: 'edit',
            loadChildren: () => import('./pages/settings/settings.module')
              .then(m => m.SettingsModule)
          }
        ]
      },
      {
        path: 'dashboard/:id',
        loadChildren: () => import('../dashboard/pages/dashboard/dashboard.module')
          .then(m => m.DashboardModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'workflow/:id',
        loadChildren: () => import('./pages/workflow/workflow.module')
          .then(m => m.WorkflowModule),
        // canActivate: [SafePermissionGuard]
      },
      {
        path: 'form/:id',
        children: [
          {
            path: '',
            loadChildren: () => import('./pages/form/form.module')
              .then(m => m.FormModule),
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder/:id',
            loadChildren: () => import('../dashboard/pages/form-builder/form-builder.module')
              .then(m => m.FormBuilderModule),
            // canActivate: [SafePermissionGuard]
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
export class ApplicationRoutingModule { }
