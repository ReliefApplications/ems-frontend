import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPageComponent } from './add-page.component';

/** List of routes of Add Page module */
const routes: Routes = [
  {
    path: '',
    component: AddPageComponent,
  },
];

/** Add page routing module */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPageRoutingModule {}
