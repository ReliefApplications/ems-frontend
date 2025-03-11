import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TriggersComponent } from './triggers.component';

/** List of routes of triggers module */
const routes: Routes = [
  {
    path: '',
    component: TriggersComponent,
  },
];

/**
 * Triggers routing module.
 */
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TriggersRoutingModule {}
