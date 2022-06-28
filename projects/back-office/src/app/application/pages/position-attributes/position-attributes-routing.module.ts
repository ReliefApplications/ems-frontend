import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionAttributesComponent } from './position-attributes.component';

const routes: Routes = [
  {
    path: '',
    component: PositionAttributesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionAttributesRoutingModule {}
