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
        path: 'tab0',
        loadChildren: () =>
          import(
            '../../../components/application-widget/application-widget.module'
          ).then((m) => m.ApplicationWidgetModule),
        outlet: '',
        // First case by default is added directly in order to trigger first load of the module with named outlet correctly
        //  outlet: 'applicationWidget0',
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
