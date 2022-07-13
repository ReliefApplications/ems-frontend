import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedSettingsComponent } from './advanced-settings.component';

/** Routes of Advanced settings page */
const routes: Routes = [
  {
    path: '',
    component: AdvancedSettingsComponent,
  },
];

/**
 * Advanced settings page routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedSettingsRoutingModule {}
