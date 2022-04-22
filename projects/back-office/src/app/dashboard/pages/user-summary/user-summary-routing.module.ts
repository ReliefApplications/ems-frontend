import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSummaryComponent } from './user-summary.component';

const routes: Routes = [
  {
    path: '',
    component: UserSummaryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserSummaryRoutingModule {}
