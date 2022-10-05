import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications.component';

export const routes = [
  {
    path: '',
    component: ApplicationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationsRoutingModule {}
