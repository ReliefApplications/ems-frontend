import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

/**
 * Actions tab of grid widget configuration modal.
 */
@Component({
  selector: 'shared-tab-actions',
  templateUrl: './tab-actions.component.html',
  styleUrls: ['./tab-actions.component.scss'],
})
export class TabActionsComponent {
  @Input() formGroup!: UntypedFormGroup;

  public actions = [
    {
      name: 'delete',
      text: 'components.widget.settings.grid.actions.delete',
      tooltip: 'components.widget.settings.grid.hint.actions.delete',
    },
    {
      name: 'history',
      text: 'components.widget.settings.grid.actions.show',
      tooltip: 'components.widget.settings.grid.hint.actions.show',
    },
    {
      name: 'convert',
      text: 'components.widget.settings.grid.actions.convert',
      tooltip: 'components.widget.settings.grid.hint.actions.convert',
    },
    {
      name: 'update',
      text: 'components.widget.settings.grid.actions.update',
      tooltip: 'components.widget.settings.grid.hint.actions.update',
    },
    {
      name: 'inlineEdition',
      text: 'components.widget.settings.grid.actions.inline',
      tooltip: 'components.widget.settings.grid.hint.actions.inline',
    },
    {
      name: 'addRecord',
      text: 'components.widget.settings.grid.actions.add',
      tooltip: 'components.widget.settings.grid.hint.actions.add',
    },
    {
      name: 'export',
      text: 'components.widget.settings.grid.actions.export',
      tooltip: 'components.widget.settings.grid.hint.actions.export',
    },
    {
      name: 'showDetails',
      text: 'components.widget.settings.grid.actions.showDetails',
      tooltip: 'components.widget.settings.grid.hint.actions.showDetails',
    },
  ];
}
