import { Component, Inject } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import {
  ButtonModule,
  MenuModule,
  SpinnerModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Add new application position component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    SpinnerModule,
    IconModule,
    MenuModule,
    TranslateModule,
    DialogModule,
    ButtonModule,
  ],
  selector: 'app-position-modal',
  templateUrl: './position-modal.component.html',
  styleUrls: ['./position-modal.component.scss'],
})
export class PositionModalComponent {
  /** Position reactive form group */
  positionForm = this.fb.group({
    title: [this.data.title, Validators.required],
  });

  /**
   * Add new application position component
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param data Injected modal data
   * @param data.add is it an addition
   * @param data.edit is it an edition
   * @param data.title title of the position
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<PositionModalComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      add: boolean;
      edit: boolean;
      title: string;
    }
  ) {}
}
