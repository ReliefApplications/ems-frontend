import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [SafeBreadcrumbComponent],
  imports: [CommonModule, RouterModule],
  exports: [SafeBreadcrumbComponent],
})
export class SafeBreadcrumbModule {}
