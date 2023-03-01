import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculatedFieldsTabComponent } from './calculated-fields-tab.component';

/** Pages of calculated fields tab */
const routes: Routes = [
  {
    path: '',
    component: CalculatedFieldsTabComponent,
  },
];

/**
 * Routing module of calculated fields tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalculatedFieldsTabRoutingModule {}
