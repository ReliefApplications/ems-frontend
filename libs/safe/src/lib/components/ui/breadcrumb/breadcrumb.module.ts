import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing'
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from '@progress/kendo-angular-indicators';

/**
 * Breadcrumb component module.
 */
@NgModule({
  declarations: [SafeBreadcrumbComponent],
  imports: [CommonModule, RouterModule, RouterTestingModule, TranslateModule, SkeletonModule],
  exports: [SafeBreadcrumbComponent],
})
export class SafeBreadcrumbModule {}
