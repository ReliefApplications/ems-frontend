import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubscriptionsComponent } from './subscriptions.component';

/** List of application subscriptions module routes */
const routes: Routes = [
  {
    path: '',
    component: SubscriptionsComponent,
  },
];

/**
 * Application subscriptions routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionsRoutingModule {}
