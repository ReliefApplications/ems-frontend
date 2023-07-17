import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveComponent } from './archive.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import {
  SafeApplicationsArchiveModule,
  SafeSkeletonTableModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [ArchiveComponent],
  imports: [
    CommonModule,
    ArchiveRoutingModule,
    SafeApplicationsArchiveModule,
    SafeSkeletonTableModule,
    TranslateModule,
  ],
  exports: [ArchiveComponent],
})
export class ArchiveModule {}
