import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormRecordsComponent } from './form-records.component';

const routes: Routes = [
  {
    path: '',
    component: FormRecordsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRecordsRoutingModule {}
