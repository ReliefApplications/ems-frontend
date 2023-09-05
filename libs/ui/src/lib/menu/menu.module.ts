import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuTriggerForDirective } from './directives/menu.directive';
import { MenuItemDirective } from './directives/menu-item.directive';

/**
 * UI Menu Module
 */
@NgModule({
  declarations: [MenuComponent, MenuTriggerForDirective, MenuItemDirective],
  imports: [CommonModule],
  exports: [MenuComponent, MenuTriggerForDirective, MenuItemDirective],
})
export class MenuModule {}
