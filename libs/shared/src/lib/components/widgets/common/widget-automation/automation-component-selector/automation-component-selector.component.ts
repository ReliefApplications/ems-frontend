import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef } from '@angular/cdk/dialog';

/** Available action components */
const ACTION_COMPONENTS = [
  {
    component: 'trigger',
    type: 'map.click',
  },
  {
    component: 'action',
    type: 'add.layer',
    value: {
      widget: null,
      layer: null,
    },
  },
  {
    component: 'action',
    type: 'remove.layer',
    value: {
      widget: null,
      layer: null,
    },
  },
  {
    component: 'action',
    type: 'set.context',
    value: {
      mapping: '',
    },
  },
  {
    component: 'action',
    type: 'map.get.country',
  },
];

/**
 * Selection of automation component.
 */
@Component({
  selector: 'shared-automation-component-selector',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslateModule, ButtonModule],
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
