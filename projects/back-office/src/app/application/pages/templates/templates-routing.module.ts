import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';

/** List of routes of application users module */
const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
  },
];

/**
 * Application users routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
