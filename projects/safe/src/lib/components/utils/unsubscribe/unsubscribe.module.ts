import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUnsubscribeComponent } from './unsubscribe.component';

@NgModule({
  declarations: [SafeUnsubscribeComponent],
  imports: [CommonModule],
  exports: [SafeUnsubscribeComponent],
})
export class SafeUnsubscribeModule {}
