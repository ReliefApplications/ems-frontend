import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule, DialogModule, FormWrapperModule } from '@oort-front/ui';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { GeoField } from '../geofield.type';

/**
 * GeoField editor dialog.
 * Enable to change the label of the geofields that appear next to map in forms.
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    FormWrapperModule,
    ButtonModule,
  ],
  selector: 'safe-edit-geofield',
  templateUrl: './edit-geofield.component.html',
  styleUrls: ['./edit-geofield.component.scss'],
})
export class EditGeofieldComponent implements OnInit {
  // === REACTIVE FORM ===
  geoFieldForm!: FormGroup;

  /**
   * edit GeoField component
   *
   * @param fb Angular form builder
   * @param dialogRef Material dialog ref
   * @param data Injected dialog data
   * @param data.geofield geofield to edit
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<EditGeofieldComponent>,
    @Inject(DIALOG_DATA)
    public data: {
      geofield: GeoField;
    }
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.geoFieldForm = this.fb.group({
      label: [this.data.geofield.label, Validators.required],
    });
  }

  /** Close the modal without sending data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
