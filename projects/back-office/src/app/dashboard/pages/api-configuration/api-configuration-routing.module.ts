import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConfigurationComponent } from './api-configuration.component';

const routes: Routes = [
  {
    path: '',
    data: {
      breadcrumb: {
        skip: true,
      },
    },
    component: ApiConfigurationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiConfigurationRoutingModule {}
