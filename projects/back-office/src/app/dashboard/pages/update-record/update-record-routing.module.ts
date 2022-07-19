import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateRecordComponent } from './update-record.component';

/**
 * Routes available for the Update record component
 */
const routes: Routes = [
  {
    path: '',
    component: UpdateRecordComponent,
  },
];

/**
 * Routing module for the Update record component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRecordRoutingModule {}
