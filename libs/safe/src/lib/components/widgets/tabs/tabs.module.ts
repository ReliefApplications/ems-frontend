import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabsModule as UITabsModule } from '@oort-front/ui';
import { TabModule } from './tab/tab.module';
import { LayoutModule } from '@progress/kendo-angular-layout';

@NgModule({
  declarations: [TabsComponent],
  imports: [CommonModule, UITabsModule, TabModule, LayoutModule],
  exports: [TabsComponent],
})
export class TabsModule {}
