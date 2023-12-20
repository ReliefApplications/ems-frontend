import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { createTabsWidgetFormGroup } from './tabs-settings.form';
import get from 'lodash/get';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { WidgetSettings } from '../../../models/dashboard.model';

/**
 * Settings of tabs widget.
 * Open in a modal.
 * todo: better types
 */
@Component({
  selector: 'shared-tabs-settings',
  templateUrl: './tabs-settings.component.html',
  styleUrls: ['./tabs-settings.component.scss'],
})
export class TabsSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, WidgetSettings<typeof extendWidgetForm>
{
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  @Output() formChange: EventEmitter<ReturnType<typeof extendWidgetForm>> =
    new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: ReturnType<typeof extendWidgetForm>;

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
    this.widgetFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
      });
  }

  /**
   * Create form group, and extend it to get display settings ( such as borderless )
   */
  public buildSettingsForm() {
    this.widgetFormGroup = extendWidgetForm(
      createTabsWidgetFormGroup(this.widget.id, this.widget.settings),
      get(this.widget, 'settings.widgetDisplay'),
      {
        usePadding: new FormControl(
          get<boolean>(this.widget.settings, 'widgetDisplay.usePadding', true)
        ),
      }
    );
  }
}
