import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';

/**
 * Declaration of routes for resources component.
 */
const routes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
  },
];

/**
 * Routing export for resources component.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {}
