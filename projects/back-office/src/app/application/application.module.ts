import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { SafeLayoutModule, SafeConfirmModalModule } from '@safe/builder';
import { ApplicationToolbarModule } from './components/application-toolbar/application-toolbar.module';

@NgModule({
  declarations: [ApplicationComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    ApplicationToolbarModule,
    SafeLayoutModule,
    SafeConfirmModalModule,
  ],
  exports: [ApplicationComponent],
})
export class ApplicationModule {}
