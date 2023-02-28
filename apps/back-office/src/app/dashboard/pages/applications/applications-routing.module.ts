import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications.component';

/** List of routes of applications page. */
const routes: Routes = [
  {
    path: '',
    component: ApplicationsComponent,
  },
];

/**
 * Applications page routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
