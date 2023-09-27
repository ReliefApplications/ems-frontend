import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import {
  LayoutModule,
  ApplicationToolbarModule,
  NavbarModule,
} from '@oort-front/shared';
import { SpinnerModule } from '@oort-front/ui';

/**
 * Application module.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ApplicationToolbarModule,
    LayoutModule,
    NavbarModule,
    SpinnerModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
