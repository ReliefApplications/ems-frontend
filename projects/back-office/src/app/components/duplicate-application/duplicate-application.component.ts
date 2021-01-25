import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-duplicate-application',
  templateUrl: './duplicate-application.component.html',
  styleUrls: ['./duplicate-application.component.scss']
})
export class DuplicateApplicationComponent implements OnInit {

  public currentApp;
  public duplicateForm: FormGroup;
  public newName;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DuplicateApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      this.currentApp = data;
    }

  ngOnInit(): void {
    this.duplicateForm = this.formBuilder.group(
      {
        id: [{ value: this.currentApp.id, disabled: true }],
        name: [this.currentApp.name, Validators.required]
      }
    );
  }

  onSubmit(): void {
    console.log(this.newName);

  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
