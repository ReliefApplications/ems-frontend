import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionsComponent } from './subscriptions.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        name: 'Subscriptions',
      },
    },
    component: SubscriptionsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsRoutingModule {}
