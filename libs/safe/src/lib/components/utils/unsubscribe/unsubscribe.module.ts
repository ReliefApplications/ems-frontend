import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeUnsubscribeComponent } from './unsubscribe.component';

/**
 * Utility to easily unsubscribe to events, such as route parameters listening, or service subject subscriptions.
 */
@NgModule({
  declarations: [SafeUnsubscribeComponent],
  imports: [CommonModule],
  exports: [SafeUnsubscribeComponent],
})
export class SafeUnsubscribeModule {}
