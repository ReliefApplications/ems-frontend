import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationTabComponent } from './validation-tab.component';

/** Pages of validation tab */
const routes: Routes = [
  {
    path: '',
    component: ValidationTabComponent,
  },
];

/**
 * Routing module of validation tab
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidationTabRoutingModule {}
