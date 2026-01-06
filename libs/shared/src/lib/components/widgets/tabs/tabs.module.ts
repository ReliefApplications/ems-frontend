import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import {
  ButtonModule,
  TabsModule as UITabsModule,
  IconModule,
} from '@oort-front/ui';
import { TabModule } from './tab/tab.module';
import { TranslateModule } from '@ngx-translate/core';
import { PortalModule } from '@angular/cdk/portal';

/**
 * Tabs widget module.
 */
@NgModule({
  declarations: [TabsComponent],
  imports: [
    CommonModule,
    UITabsModule,
    TabModule,
    TranslateModule,
    ButtonModule,
    IconModule,
    PortalModule,
  ],
  exports: [TabsComponent],
})
export class TabsModule {}
