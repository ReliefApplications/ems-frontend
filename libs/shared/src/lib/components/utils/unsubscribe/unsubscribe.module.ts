import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnsubscribeComponent } from './unsubscribe.component';

/**
 * Utility to easily unsubscribe to events, such as route parameters listening, or service subject subscriptions.
 */
@NgModule({
  declarations: [UnsubscribeComponent],
  imports: [CommonModule],
  exports: [UnsubscribeComponent],
})
export class UnsubscribeModule {}
