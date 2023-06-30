import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TabsWidgetComponent } from './tabs-widget.component';

/** List of routes of dashboard module */
const routes: Routes = [
  {
    path: '',
    component: TabsWidgetComponent,
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
        path: 'form',
        loadChildren: () =>
          import('../../application/pages/form/form.module').then(
            (m) => m.FormModule
          ),
        data: { source: 'widget' },
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('../../application/pages/form/form.module').then(
            (m) => m.FormModule
          ),
        data: { source: 'widget' },
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('../../dashboard/pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: { source: 'widget' },
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
