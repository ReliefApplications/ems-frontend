import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from '@progress/kendo-angular-indicators';

/**
 * Breadcrumb component module.
 */
@NgModule({
  declarations: [SafeBreadcrumbComponent],
  imports: [CommonModule, RouterModule, TranslateModule, SkeletonModule],
  exports: [SafeBreadcrumbComponent],
})
export class SafeBreadcrumbModule {}
