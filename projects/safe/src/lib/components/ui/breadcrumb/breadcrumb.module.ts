import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeBreadcrumbComponent } from './breadcrumb.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Breadcrumb component module.
 */
@NgModule({
  declarations: [SafeBreadcrumbComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [SafeBreadcrumbComponent],
})
export class SafeBreadcrumbModule {}
