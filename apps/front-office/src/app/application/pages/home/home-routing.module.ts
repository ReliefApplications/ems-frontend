import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

/**
 * Home page routing of application.
 */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

/**
 * Home page router of application.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
