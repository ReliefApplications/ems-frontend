import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormAnswerComponent } from './form-answer.component';

/** List of routes of form answer module */
const routes: Routes = [
  {
    path: '',
    component: FormAnswerComponent,
  },
];

/**
 * Form answer routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAnswerRoutingModule {}
