import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavContainerModule, SpinnerModule } from '@oort-front/ui';
import { AppWidgetComponent } from './app-widget.component';
import { RouterModule } from '@angular/router';

/** Application Web widget module. */
@NgModule({
  declarations: [AppWidgetComponent],
  imports: [CommonModule, RouterModule, SidenavContainerModule, SpinnerModule],
  exports: [AppWidgetComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppWidgetModule {}
