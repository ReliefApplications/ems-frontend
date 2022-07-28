import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

/** List of routes of application homepage */
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
];

/**
 * Application homepage routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
