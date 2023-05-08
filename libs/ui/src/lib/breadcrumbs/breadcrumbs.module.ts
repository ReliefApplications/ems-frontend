import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbsComponent } from './breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

/**
 * UI Breadcrumbs Module.
 */
@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, TranslateModule, RouterModule],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}
