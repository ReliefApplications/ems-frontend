import { Component, EventEmitter, Input, Output } from '@angular/core';
import { rowActions } from '../grid/grid.component';
import { get, intersection } from 'lodash';

/** Component for grid row actions */
@Component({
  selector: 'safe-grid-row-actions',
  templateUrl: './row-actions.component.html',
  styleUrls: ['./row-actions.component.scss'],
})
export class SafeGridRowActionsComponent {
  // === DATA ===
  @Input() item: any;

  // === ACTIONS ===
  @Input() actions = {
    update: false,
    delete: false,
    history: false,
    convert: false,
    remove: false,
  };
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if the component must be shown */
  get display(): boolean {
    return (
      this.actions.history ||
      this.actions.remove ||
      (this.item.canDelete && this.actions.delete) ||
      (this.item.canUpdate && (this.actions.update || this.actions.convert))
    );
  }

  /** @returns The number of actions active for the row */
  get actionLength(): number {
    return intersection(
      Object.keys(this.actions).filter((key: string) =>
        get(this.actions, key, false)
      ),
      rowActions
    ).length;
  }

  /** @returns Object for single action with action name, if is allowed and the translation key*/
  get singleAction(): {
    name: string;
    hasPermission: boolean;
    translationKey: string;
  } {
    if (this.actionLength === 1) {
      const actionReturn = {
        name: '',
        hasPermission: false,
        translationKey: '',
      };
      Object.entries(this.actions).forEach((action: any) => {
        if (rowActions.includes(action[0]) && action[1]) {
          actionReturn.name = action[0];
          // Actions that has a button in the menu
          switch (action[0]) {
            case 'update':
              actionReturn.hasPermission = action[1] && this.item.canUpdate;
              actionReturn.translationKey = 'common.update';
              break;
            case 'delete':
              actionReturn.hasPermission = action[1] && this.item.canDelete;
              actionReturn.translationKey = 'common.delete';
              break;
            case 'history':
              actionReturn.hasPermission = action[1];
              actionReturn.translationKey = 'common.history';
              break;
            case 'convert':
              actionReturn.hasPermission = action[1] && this.item.canUpdate;
              actionReturn.translationKey = 'models.record.convert';
              break;
            case 'remove':
              actionReturn.hasPermission = action[1];
              actionReturn.translationKey =
                'components.widget.settings.grid.actions.remove';
              break;
            default:
              actionReturn.hasPermission = false;
              break;
          }
        }
      });
      return actionReturn;
    }
    return { name: '', hasPermission: false, translationKey: '' };
  }
}
