import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { SafeLayoutModule } from '@safe/builder';
import { ApplicationToolbarModule } from './components/application-toolbar/application-toolbar.module';

/**
 * Application module.
 */
@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ApplicationToolbarModule,
    SafeLayoutModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
