import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import {
  SafeLayoutModule,
  SafeConfirmModalModule,
  SafeApplicationToolbarModule,
} from '@safe/builder';

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
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
