import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceComponent } from './resource.component';

/**
 * Routes available in the component
 */
const routes: Routes = [
  {
    path: '',
    component: ResourceComponent,
  },
];

/**
 * Routing module for resource component
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
