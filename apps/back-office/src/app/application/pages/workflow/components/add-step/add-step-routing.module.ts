import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStepComponent } from './add-step.component';

/** List of routes of Add step module */
const routes: Routes = [
  {
    path: '',
    component: AddStepComponent,
  },
];

/** Add step routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStepRoutingModule {}
