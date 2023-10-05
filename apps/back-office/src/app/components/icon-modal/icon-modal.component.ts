import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule, DialogModule, FormWrapperModule } from '@oort-front/ui';
import { IconPickerModule } from '@oort-front/shared';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { DIALOG_DATA } from '@angular/cdk/dialog';

/** Interface of dialog data */
interface DialogData {
  icon?: string;
}

/**
 * Icon chooser of pages / steps.
 * Use shared icon picker.
 */
@Component({
  selector: 'app-icon-modal',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    IconPickerModule,
    TranslateModule,
    ReactiveFormsModule,
    FormWrapperModule,
    ButtonModule,
  ],
  templateUrl: './icon-modal.component.html',
  styleUrls: ['./icon-modal.component.scss'],
})
export class IconModalComponent {
  iconControl = new FormControl(this.data.icon);

  /**
   * Icon chooser of pages / steps.
   * Use shared icon picker.
   *
   * @param {DialogData} data Input of dialog
   */
  constructor(@Inject(DIALOG_DATA) public data: DialogData) {}
}
