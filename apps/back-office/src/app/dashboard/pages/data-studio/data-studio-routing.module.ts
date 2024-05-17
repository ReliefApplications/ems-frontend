import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DataStudioComponent } from './data-studio.component';

/**
 * Routes of conversion module.
 */
const routes: Routes = [
  {
    path: '',
    component: DataStudioComponent,
  },
];

/**
 * DataStudio routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataStudioRoutingModule {}
