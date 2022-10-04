import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyApplicationsComponent } from './my-applications.component';
import { AccessGuard } from '../guards/access.guard';

export const routes = [
  {
    path: '',
    component: MyApplicationsComponent,
    canActivate: [AccessGuard],
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyApplicationsRoutingModule { }
