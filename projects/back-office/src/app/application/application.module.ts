import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { WhoLayoutModule } from '@who-ems/builder';

@NgModule({
  declarations: [
    ApplicationComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    WhoLayoutModule
  ],
  exports: [ApplicationComponent]
})
export class ApplicationModule { }
