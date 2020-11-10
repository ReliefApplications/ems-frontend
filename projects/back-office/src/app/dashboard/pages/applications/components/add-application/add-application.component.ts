import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-application',
  templateUrl: './add-application.component.html',
  styleUrls: ['./add-application.component.scss']
})
export class AddApplicationComponent implements OnInit {

  // === REACTIVE FORM ===
  applicationForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddApplicationComponent>
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.applicationForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  /* Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
