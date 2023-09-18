import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import {
  LayoutModule,
  EmptyModule,
  NavbarModule,
} from '@oort-front/shared';
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
    LayoutModule,
    ApplicationRoutingModule,
    EmptyModule,
    TranslateModule,
    NavbarModule,
    MenuModule,
    IconModule,
    ButtonModule,
    SpinnerModule,
  ],
})
export class ApplicationModule {}
