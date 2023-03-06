import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { ShareRoutingModule } from './share-routing.module';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

/**
 * Share Url access module.
 */
@NgModule({
  declarations: [ShareComponent],
  imports: [CommonModule, ShareRoutingModule, MatProgressSpinnerModule],
})
export class ShareModule {}
