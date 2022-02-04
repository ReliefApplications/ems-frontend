import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PositionComponent } from './position.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        skip: true,
      },
    },
    component: PositionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionRoutingModule {}
