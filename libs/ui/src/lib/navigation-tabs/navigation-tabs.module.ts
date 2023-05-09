import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationTabsComponent } from './navigation-tabs.component';
import { NavigationTabsDirective } from './navigation-tabs.directive';

/**
 * UI Navigation Tab Module
 */
@NgModule({
  declarations: [NavigationTabsComponent, NavigationTabsDirective],
  imports: [CommonModule],
  exports: [NavigationTabsComponent, NavigationTabsDirective],
})
export class NavigationTabsModule {}
