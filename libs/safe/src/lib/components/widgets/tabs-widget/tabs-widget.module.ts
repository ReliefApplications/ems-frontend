import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { TabsWidgetRoutingModule } from './tabs-widget-routing.module';
import { ButtonModule, TabsModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { SafeTabsWidgetComponent } from './tabs-widget.component';

/**
 * Tabs widget module
 */
@NgModule({
  declarations: [SafeTabsWidgetComponent],
  imports: [
    CommonModule,
    LayoutModule,
    TabsModule,
    TranslateModule,
    ButtonModule,
    TabsWidgetRoutingModule,
  ],
  exports: [SafeTabsWidgetComponent],
})
export class SafeTabsWidgetModule {}
