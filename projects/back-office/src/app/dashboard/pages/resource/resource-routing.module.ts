import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
            loadChildren: () =>
              import('./records-tab/records-tab.module').then(
                (m) => m.RecordsTabModule
              ),
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
            loadChildren: () =>
              import('./forms-tab/forms-tab.module').then(
                (m) => m.FormsTabModule
              ),
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
        loadChildren: () =>
          import('./layouts-tab/layouts-tab.module').then(
            (m) => m.LayoutsTabModule
          ),
        // canActivate: [SafePermissionGuard]
        data: {
          breadcrumb: {
            key: 'common.layout.few',
          },
        },
      },
      {
        path: 'aggregations',
        loadChildren: () =>
          import('./aggregations-tab/aggregations-tab.module').then(
            (m) => m.AggregationsTabModule
          ),
        // canActivate: [SafePermissionGuard]
        data: {
          breadcrumb: {
            key: 'common.aggregation.few',
          },
        },
      },
      {
        path: 'derived-fields',
        loadChildren: () =>
          import('./derived-fields-tab/derived-fields-tab.module').then(
            (m) => m.DerivedFieldsTabModule
          ),
        data: {
          breadcrumb: {
            key: 'common.derivedField.few',
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
