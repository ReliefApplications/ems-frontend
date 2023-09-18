import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationNotificationsComponent } from './application-notifications.component';

/** List of routes of application notifications module */
const routes: Routes = [
  {
    path: '',
    component: ApplicationNotificationsComponent,
  },
];

/**
 * Application notifications routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationNotificationsRoutingModule {}
