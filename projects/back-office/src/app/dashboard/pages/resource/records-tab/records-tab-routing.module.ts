import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordsTabComponent } from './records-tab.component';

const routes: Routes = [
  {
    path: '',
    component: RecordsTabComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecordsTabRoutingModule {}
