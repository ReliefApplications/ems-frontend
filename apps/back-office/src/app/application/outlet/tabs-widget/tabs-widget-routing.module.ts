import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsWidgetComponent } from './tabs-widget.component';

const routes: Routes = [
  {
    path: '',
    component: TabsWidgetComponent,
    children: [
      {
        path: '',
        
      },
      {
        path: 'form/:id',
        loadChildren: () =>
          import('../../pages/form/form.module').then((m) => m.FormModule),
        data: {
          view: 'widget',
        },
      },
      {
        path: 'dashboard/:id',
        loadChildren: () =>
          import('../../pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        data: {
          view: 'widget',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsWidgetRoutingModule {}
