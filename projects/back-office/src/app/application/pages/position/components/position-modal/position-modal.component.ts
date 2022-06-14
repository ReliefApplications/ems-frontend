import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-position-modal',
  templateUrl: './position-modal.component.html',
  styleUrls: ['./position-modal.component.scss'],
})
export class AddPositionComponent implements OnInit {
  // === REACTIVE FORM ===
  positionForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPositionComponent>,
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
