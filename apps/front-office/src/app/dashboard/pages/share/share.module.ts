import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { ShareRoutingModule } from './share-routing.module';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Share Url access module.
 */
@NgModule({
  declarations: [ShareComponent],
  imports: [CommonModule, ShareRoutingModule, SpinnerModule],
})
export class ShareModule {}
