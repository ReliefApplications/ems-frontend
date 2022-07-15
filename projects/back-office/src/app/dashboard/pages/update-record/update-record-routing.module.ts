import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateRecordComponent } from './update-record.component';

/**
 * Declaration of routes for update records component.
 */
const routes: Routes = [
  {
    path: '',
    component: UpdateRecordComponent,
  },
];

/**
 * Routing export for update records component.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRecordRoutingModule {}
