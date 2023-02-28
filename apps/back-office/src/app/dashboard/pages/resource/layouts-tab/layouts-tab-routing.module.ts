import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsTabComponent } from './layouts-tab.component';

/** Pages of layouts tab */
const routes: Routes = [
  {
    path: '',
    component: LayoutsTabComponent,
  },
];

/**
 * Routing module of layouts tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsTabRoutingModule {}
