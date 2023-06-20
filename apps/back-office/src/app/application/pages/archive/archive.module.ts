import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveComponent } from './archive.component';
import { ArchiveRoutingModule } from './archive-routing.module';
import { SafeApplicationsArchiveModule } from '@oort-front/safe';

/**
 * Workflow module for application preview.
 */
@NgModule({
  declarations: [ArchiveComponent],
  imports: [CommonModule, ArchiveRoutingModule, SafeApplicationsArchiveModule],
  exports: [ArchiveComponent],
})
export class ArchiveModule {}
