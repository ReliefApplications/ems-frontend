import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBreadcrumbComponent } from './breadcrumb.component';

@NgModule({
  declarations: [SafeBreadcrumbComponent],
  imports: [CommonModule],
  exports: [SafeBreadcrumbComponent],
})
export class SafeBreadcrumbModule {}
