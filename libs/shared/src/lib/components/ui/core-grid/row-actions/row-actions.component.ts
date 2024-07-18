import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { rowActions } from '../grid/grid.component';
import { get, intersection } from 'lodash';
import { GridActions } from '../models/grid-settings.model';

/** Translation keys for each of the row action types */
const ACTIONS_TRANSLATIONS: Record<(typeof rowActions)[number], string> = {
  update: 'common.update',
  delete: 'common.delete',
  history: 'common.history',
  convert: 'models.record.convert',
  remove: 'components.widget.settings.grid.actions.remove',
  showDetails: 'components.widget.settings.grid.actions.details.text',
};

/** Component for grid row actions */
@Component({
  selector: 'shared-grid-row-actions',
  templateUrl: './row-actions.component.html',
  styleUrls: ['./row-actions.component.scss'],
})
export class GridRowActionsComponent implements OnChanges {
  /** Item to be shown */
  @Input() item: any;

  /** Actions */
  @Input() actions: Partial<GridActions> = {
    update: {
      display: false,
    },
    delete: {
      display: false,
    },
    history: {
      display: false,
    },
    convert: {
      display: false,
    },
    remove: false,
    showDetails: {
      display: false,
    },
    navigateSettings: {
      field: '',
      pageUrl: '',
      title: '',
      copyLink: false,
    },
  };

  /** The actions that should be displayed */
  public availableActions: {
    action: string;
    label?: string;
    translationKey: string;
  }[] = [];

  /** Tells if only one action is enabled, if it should be displayed as a single button */
  @Input() singleActionAsButton = false;
  /** Tells if should be used instead of the menu the actions as icons side by side */
  @Input() actionsAsIcons = false;
  /** Input to indicate if has details */
  @Input() hasDetails = true;

  /** Event emitter for the action event */
  @Output() action = new EventEmitter();

  /** @returns A boolean indicating if the component must be shown */
  get display(): boolean {
    return (
      this.actions.showDetails ||
      this.actions.history ||
      this.actions.remove ||
      (this.item.canDelete && this.actions.delete) ||
      (this.item.canUpdate && (this.actions.update || this.actions.convert))
    );
  }

  ngOnChanges(): void {
    console.log(this);
    this.availableActions = intersection(
      Object.keys(this.actions).filter((key: string) =>
        get(this.actions, `${key}.display`, false)
      ),
      rowActions
    ).map((action: string) => ({
      action,
      translationKey:
        ACTIONS_TRANSLATIONS[action as (typeof rowActions)[number]],
      label: get(this.actions, `${action}.label`, undefined),
    }));
  }
}
