import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionAttributesComponent } from './position-attributes.component';

/** List of routes of position attributes module */
const routes: Routes = [
  {
    path: '',
    component: PositionAttributesComponent,
  },
];

/**
 * Position attributes routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionAttributesRoutingModule {}
