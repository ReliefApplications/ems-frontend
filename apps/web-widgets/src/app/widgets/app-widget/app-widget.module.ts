import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavContainerModule } from '@oort-front/ui';
import { AppWidgetComponent } from './app-widget.component';
import { RouterModule } from '@angular/router';
import { ApplicationRoutingService } from './services/application-routing.service';

/** Application Web widget module. */
@NgModule({
  declarations: [AppWidgetComponent],
  imports: [CommonModule, RouterModule, SidenavContainerModule],
  exports: [AppWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApplicationRoutingService],
})
export class AppWidgetModule {}
