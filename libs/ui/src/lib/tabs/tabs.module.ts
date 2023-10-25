import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs.component';
import { TabComponent } from './components/tab/tab.component';
import { TabContentDirective } from './directives/tab-content.directive';
import { TabBodyHostDirective } from './directives/tab-body-host.directive';

/**
 * UI tabs module.
 */
@NgModule({
  declarations: [
    TabsComponent,
    TabComponent,
    TabContentDirective,
    TabBodyHostDirective,
  ],
  imports: [CommonModule],
  exports: [
    TabsComponent,
    TabComponent,
    TabContentDirective,
    TabBodyHostDirective,
  ],
})
export class TabsModule {}
