import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TabsWidgetRoutingModule } from './application-widget-routing.module';
import { ButtonModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { ApplicationWidgetComponent } from './application-widget.component';

/**
 * Tabs widget module
 */
@NgModule({
  declarations: [ApplicationWidgetComponent],
  imports: [
    CommonModule,
    LayoutModule,
    TabsModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    TabsWidgetRoutingModule,
  ],
  exports: [ApplicationWidgetComponent],
})
export class ApplicationWidgetModule {}
