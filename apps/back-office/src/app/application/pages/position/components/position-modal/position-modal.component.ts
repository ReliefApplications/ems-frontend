import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
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
export class PositionModalComponent implements OnInit {
  // === REACTIVE FORM ===
  positionForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Add new application position component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   * @param data Injected modal data
   * @param data.add is it an addition
   * @param data.edit is it an edition
   * @param data.title title of the position
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<PositionModalComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      add: boolean;
      edit: boolean;
      title: string;
    }
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.positionForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
    if (this.data.edit) {
      this.positionForm.controls.title.setValue(this.data.title);
    }
  }

  /** Close the modal without sending data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
