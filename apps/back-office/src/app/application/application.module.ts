import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import {
  SafeLayoutModule,
  SafeApplicationToolbarModule,
  SafeLeftSidenavModule,
  SafeNavbarModule,
} from '@oort-front/safe';

/**
 * Application module.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    SafeApplicationToolbarModule,
    SafeLayoutModule,
    SafeLeftSidenavModule,
    SafeNavbarModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
