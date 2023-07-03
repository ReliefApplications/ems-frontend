import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeApplicationTemplatesComponent } from './application-templates.component';

/** List of routes of application templates module */
const routes: Routes = [
  {
    path: '',
    component: SafeApplicationTemplatesComponent,
  },
];

/**
 * Application templates routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafeApplicationTemplatesRoutingModule {}
