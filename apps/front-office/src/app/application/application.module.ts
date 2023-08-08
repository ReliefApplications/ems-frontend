import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import {
  SafeLayoutModule,
  SafeEmptyModule,
  SafeNavbarModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  SpinnerModule,
} from '@oort-front/ui';

/**
 * Front-Office Application module.
 * Accessible if user is authenticated.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    SafeLayoutModule,
    ApplicationRoutingModule,
    SafeEmptyModule,
    TranslateModule,
    SafeNavbarModule,
    MenuModule,
    IconModule,
    ButtonModule,
    SpinnerModule,
  ],
})
export class ApplicationModule {}
