import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsWidgetRoutingModule } from './tabs-widget-routing.module';
import { TabsWidgetComponent } from './tabs-widget.component';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { ButtonModule, TabsModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [TabsWidgetComponent],
  imports: [
    CommonModule,
    TabsWidgetRoutingModule,
    LayoutModule,
    TabsModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
  ],
})
export class TabsWidgetModule {}
