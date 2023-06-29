import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanDeactivateGuard } from '../../../guards/can-deactivate.guard';
import { DashboardComponent } from './dashboard.component';

/** List of routes of dashboard module */
const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canDeactivate: [CanDeactivateGuard],
    children: [
      {
        path: 'tab',
        loadChildren: () =>
          import(
            '../../../../../../../libs/safe/src/lib/components/widgets/tabs-widget/public-api'
          ).then((m) => m.SafeTabsWidgetModule),
        outlet: 'tabWidget',
      },
    ],
  },
];

/** Dashboard routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard],
})
export class DashboardRoutingModule {}
