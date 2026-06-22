import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  FormWrapperModule,
  IconModule,
  ToggleModule,
  TooltipModule,
} from '@oort-front/ui';
import { LocalizedInputComponent } from '../../../controls/localized-input/localized-input.component';

/** Component for selecting the widget display options */
@Component({
  selector: 'shared-display-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    TranslateModule,
    IconModule,
    TooltipModule,
    FormWrapperModule,
    LocalizedInputComponent,
  ],
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss'],
})
export class DisplaySettingsComponent {
  /**
   * Form group
   */
  @Input() formGroup!: FormGroup;
  /**
   * If should show hide empty widget options
   */
  @Input() showHideOption = false;
}
