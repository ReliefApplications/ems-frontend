import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsTabComponent } from './forms-tab/forms-tab.component';
import { LayoutsTabComponent } from './layouts-tab/layouts-tab.component';
import { RecordsTabComponent } from './records-tab/records-tab.component';
import { ResourceComponent } from './resource.component';

/** List of routes of Resource page module */
const routes: Routes = [
  {
    path: '',
    component: ResourceComponent,
    children: [
      {
        path: '',
        redirectTo: 'records',
      },
      {
        path: 'records',
        children: [
          {
            path: '',
            component: RecordsTabComponent,
          },
        ],
        data: {
          breadcrumb: {
            key: 'common.record.few',
          },
        },
      },
      {
        path: 'forms',
        children: [
          {
            path: '',
            component: FormsTabComponent,
          },
        ],
        data: {
          breadcrumb: {
            key: 'common.form.few',
          },
        },
      },
      {
        path: 'layouts',
        component: LayoutsTabComponent,
        // canActivate: [SafePermissionGuard]
        data: {
          breadcrumb: {
            key: 'common.layout.few',
          },
        },
      },
    ],
  },
];

/** Resource page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
