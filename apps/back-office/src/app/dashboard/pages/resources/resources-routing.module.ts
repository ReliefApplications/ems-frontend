import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';

/** List of routes of Resources page module */
const routes: Routes = [
  {
    path: '',
    component: ResourcesComponent,
  },
];

/** Resources page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {}
