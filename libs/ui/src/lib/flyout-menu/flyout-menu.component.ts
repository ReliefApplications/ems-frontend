import { Component, Input } from '@angular/core';
import { FlyoutMenuItem } from './interfaces/flyout-menu.interfaces';

/**
 * UI Flyout Menu Component
 */
@Component({
  selector: 'ui-flyout-menu',
  templateUrl: './flyout-menu.component.html',
  styleUrls: ['./flyout-menu.component.scss'],
})
export class FlyoutMenuComponent {
  @Input() menuLabel = '';
  @Input() menuItems: FlyoutMenuItem[] = [];
  displayMenu = false;

  /**
   * Triggers any action given on click menu item
   *
   * @param item Flyout menu item
   */
  triggerAction(item: FlyoutMenuItem) {
    if (item.action) {
      item.action();
    }
  }
}
