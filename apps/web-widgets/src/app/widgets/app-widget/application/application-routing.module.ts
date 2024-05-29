import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessGuard } from '../guards/access.guard';
import { ApplicationComponent } from './application.component';

/**
 * List of routes of the application.
 * Uses lazy loading for performance.
 */
export const routes: Routes = [
  {
    path: '',
    component: ApplicationComponent,
    children: [
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [AccessGuard],
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('./pages/form/form.module').then((m) => m.FormModule),
        canActivate: [AccessGuard],
      },
      {
        path: 'workflow/:id',
        loadChildren: () =>
          import('./pages/workflow/workflow.module').then(
            (m) => m.WorkflowModule
          ),
        canActivate: [AccessGuard],
      },
    ],
  },
];

/**
 * Application routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
