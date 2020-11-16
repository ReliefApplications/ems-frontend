import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { WhoLayoutModule } from '@who-ems/builder';
import { ApplicationToolbarModule } from './components/application-toolbar/application-toolbar.module';

@NgModule({
  declarations: [
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ApplicationToolbarModule,
    WhoLayoutModule
  ],
  exports: [ApplicationComponent]
})
export class ApplicationModule { }
