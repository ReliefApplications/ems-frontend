import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-api-configuration',
  templateUrl: './add-api-configuration.component.html',
  styleUrls: ['./add-api-configuration.component.scss'],
})
export class AddApiConfigurationComponent implements OnInit {
  // === REACTIVE FORM ===
  apiForm: FormGroup = new FormGroup({});

  get name(): AbstractControl | null {
    return this.apiForm.get('name');
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddApiConfigurationComponent>
  ) {}

  /** Build the form. */
  ngOnInit(): void {
    this.apiForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z-_]+$')]],
    });
  }

  /** Close the modal without sending data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
