import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateRecordComponent } from './update-record.component';

/** List of update record routes */
const routes: Routes = [
  {
    path: '',
    component: UpdateRecordComponent,
  },
];

/** Update record page module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRecordRoutingModule {}
