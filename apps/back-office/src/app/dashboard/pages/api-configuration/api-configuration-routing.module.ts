import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConfigurationComponent } from './api-configuration.component';

/** List of routes of API configuration module */
const routes: Routes = [
  {
    path: '',
    component: ApiConfigurationComponent,
  },
];

/** API configuration routing module. */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiConfigurationRoutingModule {}
