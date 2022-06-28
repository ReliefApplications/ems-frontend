import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdateRecordComponent } from './update-record.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateRecordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateRecordRoutingModule {}
