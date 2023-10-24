import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import { SafeLayoutModule, SafeNavbarModule } from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Front-Office Dashboard module.
 * Accessible if user is authenticated.
 * Main Navigation.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    SafeLayoutModule,
    ApplicationRoutingModule,
    TranslateModule,
    SafeNavbarModule,
    MenuModule,
    IconModule,
    ButtonModule,
    SpinnerModule,
    TooltipModule,
  ],
})
export class ApplicationModule {}
