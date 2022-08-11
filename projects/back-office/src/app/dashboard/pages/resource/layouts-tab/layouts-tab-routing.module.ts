import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsTabComponent } from './layouts-tab.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutsTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutsTabRoutingModule {}
