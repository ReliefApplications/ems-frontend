import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsTabComponent } from './forms-tab.component';

/**
 * Forms tab routes
 */
const routes: Routes = [
  {
    path: '',
    component: FormsTabComponent,
  },
];

/**
 * Routing module of forms tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsTabRoutingModule {}
