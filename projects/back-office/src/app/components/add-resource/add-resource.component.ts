import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-resource',
  templateUrl: './add-resource.component.html',
  styleUrls: ['./add-resource.component.scss'],
})
export class AddResourceComponent implements OnInit {
  // === REACTIVE FORM ===
  public addForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddResourceComponent>
  ) {}

  /*  Load the resources and build the form.
   */
  ngOnInit(): void {
    this.addForm = this.formBuilder.group({
      name: ['', Validators.required],
      binding: ['newResource'],
    });
  }

  /*  Close the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
