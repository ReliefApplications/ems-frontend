import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddStepComponent } from './add-step.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        name: 'New step',
      },
    },
    component: AddStepComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddStepRoutingModule {}
