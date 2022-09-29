import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DerivedFieldsTabComponent } from './derived-fields-tab.component';

/** Pages of derived fields tab */
const routes: Routes = [
  {
    path: '',
    component: DerivedFieldsTabComponent,
  },
];

/**
 * Routing module of derived fields tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DerivedFieldsTabRoutingModule {}
