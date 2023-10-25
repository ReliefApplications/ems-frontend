import { NgModule } from '@angular/core';
import { ErrorMessageDirective } from './error-message.directive';

/**
 * Ui Error Message module
 */
@NgModule({
  declarations: [ErrorMessageDirective],
  exports: [ErrorMessageDirective],
})
export class ErrorMessageModule {}
