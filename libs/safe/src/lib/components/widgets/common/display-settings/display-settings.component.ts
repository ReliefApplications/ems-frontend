import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { TranslateModule } from '@ngx-translate/core';

/** Component for selecting the widget display options */
@Component({
  selector: 'safe-display-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    TranslateModule,
  ],
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss'],
})
export class DisplaySettingsComponent {
  @Input() formGroup!: FormGroup;

  /** @returns a FormControl for the showBorder field */
  get showBorderControl() {
    // Using this approach instead of formGroupName / formControlName
    // because it's not possible to resolve the control if the element with
    // the formGroupName is coming from the ng-content.
    // It would work for the common fields between the widgets (such as showBorder)
    // but I decided not to, to keep it consistent.
    // For more information, see: https://github.com/angular/angular/issues/13761

    return this.formGroup.get('widgetDisplay.showBorder') as FormControl;
  }
}
