import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  IconModule,
  ToggleModule,
  TextareaModule,
  TooltipModule,
} from '@oort-front/ui';

/** Component for selecting the widget display options */
@Component({
  selector: 'shared-display-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    TextareaModule,
    TranslateModule,
    IconModule,
    TooltipModule,
  ],
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss'],
})
export class DisplaySettingsComponent {
  /**
   * Form group
   */
  @Input() formGroup!: FormGroup;
}
