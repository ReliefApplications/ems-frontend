import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './forms.component';

/** List of routes of forms page module */
const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
  },
];

/** Forms page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}
