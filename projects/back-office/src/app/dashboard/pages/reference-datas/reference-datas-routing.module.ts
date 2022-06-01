import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceDatasComponent } from './reference-datas.component';

/**
 * List of routes of Reference Datas module.
 */
const routes: Routes = [
  {
    path: '',
    component: ReferenceDatasComponent,
  },
];

/**
 * Reference datas routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceDatasRoutingModule {}
