import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { LayoutModule, NavbarModule } from '@oort-front/shared';
import { SpinnerModule } from '@oort-front/ui';
import { ApplicationHeaderModule } from '../components/application-header/application-header.module';

/**
 * Application module.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ApplicationHeaderModule,
    LayoutModule,
    NavbarModule,
    SpinnerModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
