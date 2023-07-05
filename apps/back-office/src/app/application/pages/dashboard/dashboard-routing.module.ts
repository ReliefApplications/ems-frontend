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
          import('../../outlet/tabs-widget/tabs-widget.module').then(
            (m) => m.TabsWidgetModule
          ),
        outlet: 'tabWidget',
        // loadChildren: () => import(

        // )
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
