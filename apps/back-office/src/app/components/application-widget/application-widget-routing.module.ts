import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationWidgetComponent } from './application-widget.component';

/** List of routes of dashboard module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationWidgetComponent,
    data: { source: 'widget' },
    children: [
      {
        path: 'add-page',
        loadChildren: () =>
          import('../../application/pages/add-page/add-page.module').then(
            (m) => m.AddPageModule
          ),
        data: { source: 'widget' },
      },
      {
        path: 'form/:id',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../application/pages/form/form.module').then(
                (m) => m.FormModule
              ),
            data: { source: 'widget' },
            // canActivate: [SafePermissionGuard]
          },
          {
            path: 'builder/:id',
            loadChildren: () =>
              import(
                '../../dashboard/pages/form-builder/form-builder.module'
              ).then((m) => m.FormBuilderModule),
            data: { source: 'widget' },
            // canActivate: [SafePermissionGuard]
          },
        ],
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { source: 'widget' },
      },
    ],
  },
];

/** Dashboard routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  //   providers: [CanDeactivateGuard],
})
export class TabsWidgetRoutingModule {}
