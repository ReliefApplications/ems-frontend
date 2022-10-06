import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications.component';

/** List of routes of Applications page */
export const routes = [
  {
    path: '',
    component: ApplicationsComponent,
  },
];

/**
 * Routing module of applications page.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
