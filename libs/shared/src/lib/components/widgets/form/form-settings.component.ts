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
import get from 'lodash/get';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';

/**
 * Settings of Form widget.
 * Open in a modal.
 */
@Component({
  selector: 'shared-form-settings',
  templateUrl: './form-settings.component.html',
  styleUrls: ['./form-settings.component.scss'],
})
export class FormSettingsComponent
  extends UnsubscribeComponent
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
