import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { createTabsWidgetFormGroup } from './tabs-settings.form';
import get from 'lodash/get';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

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
export class TabsSettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit, AfterViewInit
{
  /** Settings */
  public widgetForm!: FormGroup;
  /** Widget definition */
  @Input() tile: any;
  /** Emit the applied change */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    // Create form group, and extend it to get display settings ( such as borderless )
    this.widgetForm = extendWidgetForm(
      createTabsWidgetFormGroup(this.tile.id, this.tile.settings),
      get(this.tile, 'settings.widgetDisplay')
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
}
