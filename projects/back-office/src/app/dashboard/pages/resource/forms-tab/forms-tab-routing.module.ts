import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsTabComponent } from './forms-tab.component';

const routes: Routes = [
  {
    path: '',
    component: FormsTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormsTabRoutingModule {}
