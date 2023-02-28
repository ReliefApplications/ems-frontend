import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SafeApplicationNotificationsComponent } from './application-notifications.component';

/** List of routes of application notifications module */
const routes: Routes = [
  {
    path: '',
    component: SafeApplicationNotificationsComponent,
  },
];

/**
 * Application notifications routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SafeApplicationNotificationsRoutingModule {}
