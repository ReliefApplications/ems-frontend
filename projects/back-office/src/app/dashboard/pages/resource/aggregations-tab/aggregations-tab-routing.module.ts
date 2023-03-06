import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AggregationsTabComponent } from './aggregations-tab.component';

/** Pages of aggregations tab */
const routes: Routes = [
  {
    path: '',
    component: AggregationsTabComponent,
  },
];

/**
 * Routing module of aggregations tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationsTabRoutingModule {}
