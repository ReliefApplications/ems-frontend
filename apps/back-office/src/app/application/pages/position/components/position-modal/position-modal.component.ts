import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from '@angular/material/legacy-dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SafeButtonModule, SafeModalModule } from '@oort-front/safe';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Add new application position component (modal)
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    SafeButtonModule,
    MatButtonModule,
    TranslateModule,
    SafeModalModule,
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
    public dialogRef: MatDialogRef<PositionModalComponent>,
    @Inject(MAT_DIALOG_DATA)
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
