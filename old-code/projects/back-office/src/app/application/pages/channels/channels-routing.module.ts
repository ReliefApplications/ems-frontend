import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './channels.component';

/** List of routes of channels module */
const routes: Routes = [
  {
    path: '',
    component: ChannelsComponent,
  },
];

/**
 * Channels routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChannelsRoutingModule {}
