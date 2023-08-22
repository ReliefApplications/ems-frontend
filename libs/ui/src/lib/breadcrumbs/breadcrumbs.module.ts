import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { SkeletonModule } from '@progress/kendo-angular-indicators';

/**
 * UI Breadcrumbs Module.
 */
@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, TranslateModule, RouterModule, SkeletonModule],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}
