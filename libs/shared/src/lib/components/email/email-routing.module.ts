import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailComponent } from './email.component';
//import { PreviewComponent } from './steps/preview/preview.component';

/** List of routes of application emailpage */
const routes: Routes = [
  {
    path: '',
    component: EmailComponent,
  },
];

/**
 * Application emailpage routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule {}
