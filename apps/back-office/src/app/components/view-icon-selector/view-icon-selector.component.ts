import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormWrapperModule } from '@oort-front/ui';
import { IconPickerModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

/**
 * Icon chooser of pages / steps.
 * Use shared icon picker.
 */
@Component({
  selector: 'app-view-icon-selector',
  standalone: true,
  imports: [
    CommonModule,
    IconPickerModule,
    TranslateModule,
    ReactiveFormsModule,
    FormWrapperModule,
  ],
  templateUrl: './view-icon-selector.component.html',
  styleUrls: ['./view-icon-selector.component.scss'],
})
export class ViewIconSelectorComponent {
  /** Icon name form control */
  @Input() iconControl!: FormControl;
}
