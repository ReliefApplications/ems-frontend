import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormAnswerComponent } from './form-answer.component';

const routes: Routes = [
  {
    path: '',
    component: FormAnswerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormAnswerRoutingModule {}
