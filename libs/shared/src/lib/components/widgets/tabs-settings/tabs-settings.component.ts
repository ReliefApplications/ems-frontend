import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { createTabsWidgetFormGroup } from './tabs-settings.form';
import get from 'lodash/get';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

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
  implements OnInit, AfterViewInit, OnDestroy
{
  /** Settings */
  public widgetForm!: FormGroup;
  /** Widget definition */
  @Input() widget: any;
  /** Emit the applied change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    // Create form group, and extend it to get display settings ( such as borderless )
    this.widgetForm = extendWidgetForm(
      createTabsWidgetFormGroup(this.widget.id, this.widget.settings),
      get(this.widget, 'settings.widgetDisplay')
    );
    this.change.emit(this.widgetForm);
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.change.emit(this.widgetForm);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.widgetForm.value.tabs.forEach((tab: any) => {
      if (tab.structure.length == 1) {
        //if only one widget, we set its height to the height of the tabs widget
        tab.structure[0].rows = this.widget.rows;
      }
    });
  }
}
