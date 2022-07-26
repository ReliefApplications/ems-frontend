import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceComponent } from './resource.component';

/** List of routes of Resource page module */
const routes: Routes = [
  {
    path: '',
    component: ResourceComponent,
  },
];

/** Resource page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourceRoutingModule {}
