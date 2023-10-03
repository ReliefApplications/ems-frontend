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
  selector: 'app-page-icon',
  standalone: true,
  imports: [
    CommonModule,
    IconPickerModule,
    TranslateModule,
    ReactiveFormsModule,
    FormWrapperModule,
  ],
  templateUrl: './page-icon.component.html',
  styleUrls: ['./page-icon.component.scss'],
})
export class PageIconComponent {
  /** Icon name form control */
  @Input() iconControl!: FormControl;
}
