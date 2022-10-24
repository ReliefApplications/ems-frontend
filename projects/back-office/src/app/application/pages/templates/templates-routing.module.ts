import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';

/** List of routes of application templates module */
const routes: Routes = [
  {
    path: '',
    component: TemplatesComponent,
  },
];

/**
 * Application templates routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TemplatesRoutingModule {}
