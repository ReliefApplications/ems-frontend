import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoFormComponent } from './no-form.component';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '', // This matches the "root" of whatever path loaded this module
    component: NoFormComponent
  }
];

@NgModule({
  declarations: [NoFormComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule],
  providers: [],
  bootstrap: [NoFormComponent],
})
export class NoFormModule {}
