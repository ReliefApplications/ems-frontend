import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  IconModule,
  MenuModule,
  SpinnerModule,
} from '@oort-front/ui';
import { AppWidgetComponent } from './app-widget.component';
import { LayoutModule, NavbarModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationRoutingModule } from './app-widget-routing.module';

/** Form Web widget module. */
@NgModule({
  declarations: [AppWidgetComponent],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MenuModule,
    IconModule,
    SpinnerModule,
    ButtonModule,
    NavbarModule,
    LayoutModule,
    TranslateModule,
  ],
  exports: [AppWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppWidgetModule {}
