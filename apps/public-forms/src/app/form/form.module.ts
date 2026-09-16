import { NgModule } from '@angular/core';
import { FormComponent } from './form.component';
import { CommonModule } from '@angular/common';
import { FormModule as SharedFormModule } from '@oort-front/shared';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from '@oort-front/ui';

/**
 * Routes of the form module.
 */
const routes: Routes = [
  {
    path: '', // This matches the "root" of whatever path loaded this module
    component: FormComponent,
  },
];

/**
 * Public form page module.
 */
@NgModule({
  declarations: [FormComponent],
  imports: [
    CommonModule,
    SharedFormModule,
    RouterModule.forChild(routes),
    TranslateModule,
    ButtonModule,
  ],
  bootstrap: [FormComponent],
})
export class FormModule {}
