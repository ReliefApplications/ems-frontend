import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReferenceDatasComponent } from './reference-datas.component';

const routes: Routes = [
  {
    path: '',
    component: ReferenceDatasComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceDatasRoutingModule {}
