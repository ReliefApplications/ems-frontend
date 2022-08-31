import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';

/** List of Application settings routes */
const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];

/**
 * Application settings routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsRoutingModule {}
