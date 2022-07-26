import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionComponent } from './position.component';

/** List of routes of application position module */
const routes: Routes = [
  {
    path: '',
    component: PositionComponent,
  },
];

/**
 * Application position routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionRoutingModule {}
