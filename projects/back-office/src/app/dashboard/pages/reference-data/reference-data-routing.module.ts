import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceDataComponent } from './reference-data.component';

/**
 * Routes of reference data module.
 */
const routes: Routes = [
  {
    path: '',
    component: ReferenceDataComponent,
  },
];

/**
 * Reference data routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceDataRoutingModule {}
