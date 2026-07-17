import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoFormComponent } from './no-form.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Routes of the no-form module.
 */
const routes: Routes = [
  {
    path: '', // This matches the "root" of whatever path loaded this module
    component: NoFormComponent,
  },
];

/**
 * Fallback page module, displayed when no public form matches the url.
 */
@NgModule({
  declarations: [NoFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
  providers: [],
  bootstrap: [NoFormComponent],
})
export class NoFormModule {}
