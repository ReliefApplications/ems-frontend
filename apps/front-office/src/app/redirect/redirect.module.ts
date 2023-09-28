import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectComponent } from './redirect.component';
import { RedirectRoutingModule } from './redirect-routing.module';
import { SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyModule } from '@oort-front/shared';

/**
 * Redirect module of front-office.
 */
@NgModule({
  declarations: [RedirectComponent],
  imports: [
    CommonModule,
    RedirectRoutingModule,
    SpinnerModule,
    EmptyModule,
    TranslateModule,
  ],
})
export class RedirectModule {}
