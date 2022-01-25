import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AggregationBuilderComponent } from './aggregation-builder.component';

const routes: Routes = [
  {
    path: '',
    component: AggregationBuilderComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggregationBuilderRoutingModule {}
