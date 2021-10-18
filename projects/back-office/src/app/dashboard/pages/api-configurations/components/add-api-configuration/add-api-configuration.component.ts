import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import {ErrorStateMatcher} from '@angular/material/core';

@Component({
  selector: 'app-add-api-configuration',
  templateUrl: './add-api-configuration.component.html',
  styleUrls: ['./add-api-configuration.component.scss']
})
export class AddApiConfigurationComponent implements OnInit {
  // === REACTIVE FORM ===
  apiForm: FormGroup = new FormGroup({});

  constructor(
      private formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<AddApiConfigurationComponent>
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.apiForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
