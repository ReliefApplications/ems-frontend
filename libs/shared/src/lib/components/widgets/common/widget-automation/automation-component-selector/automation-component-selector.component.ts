import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule, TooltipModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef } from '@angular/cdk/dialog';
import {
  ActionWithValue,
  ActionType,
} from '../../../../../models/automation.model';

/** Available action components */
const ACTION_COMPONENTS: ActionWithValue[] = [
  { component: 'trigger', type: ActionType.mapClick },
  {
    component: 'action',
    type: ActionType.addLayer,
    value: {
      widget: null,
      layers: null,
    },
  },
  {
    component: 'action',
    type: ActionType.removeLayer,
    value: {
      widget: null,
      layers: null,
    },
  },
  {
    component: 'action',
    type: ActionType.addTab,
    value: {
      widget: null,
      tabs: null,
    },
  },
  {
    component: 'action',
    type: ActionType.openTab,
    value: {
      widget: null,
      tab: null,
    },
  },
  {
    component: 'action',
    type: ActionType.removeTab,
    value: {
      widget: null,
      tabs: null,
    },
  },
  {
    component: 'action',
    type: ActionType.displayCollapse,
    value: {
      widget: null,
    },
  },
  {
    component: 'action',
    type: ActionType.displayExpand,
    value: {
      widget: null,
    },
  },
  {
    component: 'action',
    type: ActionType.setContext,
    value: {
      mapping: '',
    },
  },
  {
    component: 'action',
    type: ActionType.mapGetCountry,
  },
];

/**
 * Selection of automation component.
 */
@Component({
  selector: 'shared-automation-component-selector',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './automation-component-selector.component.html',
  styleUrls: ['./automation-component-selector.component.scss'],
})
export class AutomationComponentSelectorComponent {
  /** Available action components */
  public actionComponents = ACTION_COMPONENTS;

  /**
   * Selection of automation component.
   *
   * @param dialogRef Dialog ref
   */
  constructor(
    private dialogRef: DialogRef<AutomationComponentSelectorComponent>
  ) {}

  /**
   * Select the component.
   *
   * @param component component to use
   */
  onSelect(component: any) {
    this.dialogRef.close(component);
  }
}
