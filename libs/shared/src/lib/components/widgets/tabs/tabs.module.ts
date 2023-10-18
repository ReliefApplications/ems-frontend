import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { ButtonModule, TabsModule as UITabsModule } from '@oort-front/ui';
import { TabModule } from './tab/tab.module';
import { TranslateModule } from '@ngx-translate/core';

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
  ],
  exports: [TabsComponent],
})
export class TabsModule {}
