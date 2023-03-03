import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsTabComponent } from './records-tab.component';

/** Pages of records tab of resource page */
const routes: Routes = [
  {
    path: '',
    component: RecordsTabComponent,
  },
];

/**
 * Routing module of records tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsTabRoutingModule {}
