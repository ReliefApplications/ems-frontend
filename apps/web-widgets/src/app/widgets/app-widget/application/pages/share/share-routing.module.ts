import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareComponent } from './share.component';

/** List of routes */
const routes: Routes = [
  {
    path: '',
    component: ShareComponent,
    children: [],
  },
];

/**
 * Routing of Share module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShareRoutingModule {}
