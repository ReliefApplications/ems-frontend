import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApiConfigurationsComponent } from './api-configurations.component';

const routes: Routes = [
  {
    path: '',
    component: ApiConfigurationsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiConfigurationsRoutingModule {}
