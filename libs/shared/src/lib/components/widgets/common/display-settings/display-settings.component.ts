import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  DividerModule,
  FormWrapperModule,
  SelectMenuModule,
  ToggleModule,
} from '@oort-front/ui';

/** Component for selecting the widget display options */
@Component({
  selector: 'shared-display-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FormWrapperModule,
    ReactiveFormsModule,
    ToggleModule,
    TranslateModule,
    SelectMenuModule,
    DividerModule,
  ],
  templateUrl: './display-settings.component.html',
  styleUrls: ['./display-settings.component.scss'],
})
export class DisplaySettingsComponent {
  @Input() formGroup!: FormGroup;
  @Input() widgetType: 'map' | undefined;
}
