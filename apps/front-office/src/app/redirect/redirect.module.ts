import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectComponent } from './redirect.component';
import { RedirectRoutingModule } from './redirect-routing.module';
import { SpinnerModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeEmptyModule } from '@oort-front/safe';

/**
 * Redirect module of front-office.
 */
@NgModule({
  declarations: [RedirectComponent],
  imports: [
    CommonModule,
    RedirectRoutingModule,
    SpinnerModule,
    SafeEmptyModule,
    TranslateModule,
  ],
})
export class RedirectModule {}
