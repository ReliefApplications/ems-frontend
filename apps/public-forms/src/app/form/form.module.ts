import { NgModule } from '@angular/core';
import { FormComponent } from './form.component';
import { CommonModule } from '@angular/common';
import {
  FormModule as SharedFormModule,
} from '@oort-front/shared';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', // This matches the "root" of whatever path loaded this module
    component: FormComponent
  }
];

@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SharedFormModule,
    RouterModule.forChild(routes)
  ],
  bootstrap: [FormComponent],
})
export class FormModule {}