import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConfigurationsComponent } from './api-configurations.component';

/** List of API configuration module routes */
const routes: Routes = [
  {
    path: '',
    component: ApiConfigurationsComponent,
  },
];

/**
 * API configuration routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiConfigurationsRoutingModule {}
