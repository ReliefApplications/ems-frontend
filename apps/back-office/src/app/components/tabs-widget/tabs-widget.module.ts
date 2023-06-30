import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TabsWidgetRoutingModule } from './tabs-widget-routing.module';
import { ButtonModule, TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { TabsWidgetComponent } from './tabs-widget.component';

/**
 * Tabs widget module
 */
@NgModule({
  declarations: [TabsWidgetComponent],
  imports: [
    CommonModule, 
    LayoutModule,
    TabsModule,
    TranslateModule,
    ButtonModule,
    TabsWidgetRoutingModule,
  ],
  exports: [TabsWidgetComponent],
})
export class TabsWidgetModule {}
