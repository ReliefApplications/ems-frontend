import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvancedSettingsComponent } from './advanced-settings.component';

const routes: Routes = [
  {
    path: '',
    component: AdvancedSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancedSettingsRoutingModule {}
