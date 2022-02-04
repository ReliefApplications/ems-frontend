import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPageComponent } from './add-page.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        name: 'Add a Page',
      },
    },
    component: AddPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPageRoutingModule {}
