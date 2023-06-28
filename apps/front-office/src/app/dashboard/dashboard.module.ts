import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import {
  SafeLayoutModule,
  SafeEmptyModule,
  SafeNavbarModule,
} from '@oort-front/safe';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, IconModule, MenuModule } from '@oort-front/ui';

/**
 * Front-Office Dashboard module.
 * Accessible if user is authenticated.
 * Main Navigation.
 */
@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    SafeLayoutModule,
    DashboardRoutingModule,
    SafeEmptyModule,
    TranslateModule,
    SafeNavbarModule,
    MenuModule,
    IconModule,
    ButtonModule,
  ],
})
export class DashboardModule {}
