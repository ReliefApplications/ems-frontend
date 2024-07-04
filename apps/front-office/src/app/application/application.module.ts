import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { ApplicationRoutingModule } from './application-routing.module';
import {
  LayoutModule,
  EmptyModule,
  NavbarModule,
  DashboardFilterIconComponent,
} from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  ChipModule,
  IconModule,
  MenuModule,
  SpinnerModule,
  TooltipModule,
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
    TooltipModule,
    DashboardFilterIconComponent,
    ChipModule,
  ],
})
export class ApplicationModule {}
