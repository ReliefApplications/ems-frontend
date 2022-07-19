import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';

/**
 * Available routes in the component
 */
const routes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
  },
];

/**
 * Routing module for resources component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {}
