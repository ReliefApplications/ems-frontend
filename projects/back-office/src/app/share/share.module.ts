import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareComponent } from './share.component';
import { ShareRoutingModule } from './share-routing.module';
import { SafeShareRedirectModule } from '@safe/builder';

@NgModule({
  declarations: [ShareComponent],
  imports: [CommonModule, ShareRoutingModule, SafeShareRedirectModule],
})
export class ShareModule {}
