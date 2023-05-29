import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { Geofield } from '@oort-front/safe';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '@oort-front/safe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SafeModalModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
  ],
  selector: 'safe-edit-geofield',
  templateUrl: './edit-geofield.component.html',
  styleUrls: ['./edit-geofield.component.scss'],
})
export class EditGeofieldComponent implements OnInit{
  // === REACTIVE FORM ===
  geoFieldForm: UntypedFormGroup = new UntypedFormGroup({});

  /**
   * Add API configuration component
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   * @param data Injected dialog data
   * @param data.geofield geofield to edit
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<EditGeofieldComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      geofield: Geofield;
    }
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.geoFieldForm = this.formBuilder.group({
      label: [this.data.geofield.label, Validators.required],
    });
  }

  /** Close the modal without sending data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
