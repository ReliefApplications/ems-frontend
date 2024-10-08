import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { EmptyModule } from '@oort-front/shared';

/**
 * Error page module.
 */
@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ErrorRoutingModule, EmptyModule],
})
export class ErrorModule {}
