import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DialogRef } from '@angular/cdk/dialog';

const ACTION_COMPONENTS = [
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
];

@Component({
  selector: 'shared-automation-component-selector',
  standalone: true,
  imports: [CommonModule, DialogModule, TranslateModule, ButtonModule],
  templateUrl: './automation-component-selector.component.html',
  styleUrls: ['./automation-component-selector.component.scss'],
})
export class AutomationComponentSelectorComponent {
  public actionComponents = ACTION_COMPONENTS;

  constructor(
    private dialogRef: DialogRef<AutomationComponentSelectorComponent>
  ) {}

  onSelect(action: any) {
    console.log(action);
    this.dialogRef.close(action);
  }
}
