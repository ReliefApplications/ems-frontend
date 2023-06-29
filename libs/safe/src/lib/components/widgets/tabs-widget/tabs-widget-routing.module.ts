import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeTabsWidgetComponent } from './tabs-widget.component';

/** List of routes of dashboard module */
const routes: Routes = [
  {
    path: '',
    component: SafeTabsWidgetComponent,
    children: [
      {
        path: 'add-page',
        loadChildren: () =>
          import(
            '../../../../../../../apps/back-office/src/app/application/pages/add-page/add-page.module'
          ).then((m) => m.AddPageModule),
        data: { source: 'widget' },
        // outlet: 'pages',
      },
      {
        path: 'form',
        loadChildren: () =>
          import(
            '../../../../../../../apps/back-office/src/app/application/pages/form/form.module'
          ).then((m) => m.FormModule),
        outlet: 'pages',
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import(
            '../../../../../../../apps/back-office/src/app/application/pages/form/form.module'
          ).then((m) => m.FormModule),
        outlet: 'pages',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import(
            '../../../../../../../apps/back-office/src/app/dashboard/pages/dashboard/dashboard.module'
          ).then((m) => m.DashboardModule),
        outlet: 'pages',
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import(
            '../../../../../../../apps/back-office/src/app/dashboard/pages/dashboard/dashboard.module'
          ).then((m) => m.DashboardModule),
        outlet: 'pages',
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
