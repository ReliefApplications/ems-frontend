import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu.component';
import { MenuTriggerForDirective } from './menu.directive';

/**
 * UI Menu Module
 */
@NgModule({
  declarations: [MenuComponent, MenuTriggerForDirective],
  imports: [CommonModule],
  exports: [MenuComponent, MenuTriggerForDirective],
})
export class MenuModule {}
