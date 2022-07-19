import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsComponent } from './forms.component';

/**
 * Routes available for the forms component
 */
const routes: Routes = [
  {
    path: '',
    component: FormsComponent,
  },
];

/**
 * Routing module for forms component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsRoutingModule {}
