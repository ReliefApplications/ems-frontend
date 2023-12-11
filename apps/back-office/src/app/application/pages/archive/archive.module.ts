import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveComponent } from './archive.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import {
  ApplicationsArchiveModule,
  SkeletonTableModule,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [ArchiveComponent],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    ApplicationsArchiveModule,
    SkeletonTableModule,
    TranslateModule,
  ],
  exports: [ArchiveComponent],
})
export class ArchiveModule {}
