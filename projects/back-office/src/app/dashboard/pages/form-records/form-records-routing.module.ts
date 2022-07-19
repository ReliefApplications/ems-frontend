import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormRecordsComponent } from './form-records.component';

/**
 * Avilable routes for the forms-record component
 */
const routes: Routes = [
  {
    path: '',
    component: FormRecordsComponent,
  },
];

/**
 * Routing module for forms-record component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormRecordsRoutingModule {}
