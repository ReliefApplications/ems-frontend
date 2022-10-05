import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApplicationsComponent } from './applications.component';
import { AccessGuard } from '../../../guards/access.guard';

export const routes = [
  {
    path: '',
    component: ApplicationsComponent,
    children: [
      {
        path: ':id',
        loadChildren: () =>
          import('../../../dashboard/dashboard.module').then((m) => { console.log("DASHBOARD"); return m.DashboardModule}),
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationsRoutingModule { }
