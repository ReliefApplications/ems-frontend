import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EmptyModule } from '../ui/empty/empty.module';
import { ErrorRoutingModule } from './error-routing.module';
import { ErrorComponent } from './error.component';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Error page module.
 */
@NgModule({
  declarations: [ErrorComponent],
  imports: [CommonModule, ErrorRoutingModule, EmptyModule, TranslateModule],
})
export class ErrorModule {}
