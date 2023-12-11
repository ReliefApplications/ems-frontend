import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShareComponent } from './share.component';
import { IsNormalizeUrl } from '../../../guards/normalize-url.guard';

/** List of routes */
const routes: Routes = [
  {
    path: '',
    component: ShareComponent,
    canActivate: [IsNormalizeUrl],
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
