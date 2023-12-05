import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationTemplatesComponent } from './application-templates.component';

/** List of routes of application templates module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationTemplatesComponent,
  },
];

/**
 * Application templates routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationTemplatesRoutingModule {}
