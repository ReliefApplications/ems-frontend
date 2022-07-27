import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormRecordsComponent } from './form-records.component';

/** List of routes of Form Records module */
const routes: Routes = [
  {
    path: '',
    component: FormRecordsComponent,
  },
];

/** Form records routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRecordsRoutingModule {}
