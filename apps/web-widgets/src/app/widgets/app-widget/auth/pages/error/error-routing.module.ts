import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error.component';

/** Available routes */
const routes: Routes = [
  {
    path: '',
    component: ErrorComponent,
  },
];

/**
 * Error routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}
