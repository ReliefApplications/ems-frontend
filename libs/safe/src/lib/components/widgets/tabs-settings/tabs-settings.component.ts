import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { createTabsWidgetFormGroup } from './tabs-settings.form';
import get from 'lodash/get';

/**
 * Settings of tabs widget.
 * Open in a modal.
 * todo: better types
 */
@Component({
  selector: 'safe-tabs-settings',
  templateUrl: './tabs-settings.component.html',
  styleUrls: ['./tabs-settings.component.scss'],
})
export class TabsSettingsComponent implements OnInit {
  /** Settings */
  public widgetForm!: FormGroup;
  /** Widget definition */
  @Input() tile: any;

  ngOnInit(): void {
    // Create form group, and extend it to get display settings ( such as borderless )
    this.widgetForm = extendWidgetForm(
      createTabsWidgetFormGroup(this.tile.id, this.tile.settings),
      get(this.tile, 'settings.widgetDisplay')
    );
  }
}
