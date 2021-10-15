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
  regex = new RegExp('[a-zA-Z_]');
  displayError = false;
  matcher = new MyErrorStateMatcher();

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
    console.log('this.apiForm');
    console.log(this.apiForm);
    this.dialogRef.close();
  }

  addConfiguration(): void {
    if (this.regex.test(this.apiForm.value.name)){
      this.dialogRef.close(this.apiForm.value);
    }
    else {
      console.log('nathiiiiiiin');
      this.displayError = true;
    }
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  regex = new RegExp('[a-zA-Z_]');
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.regex.test(control?.value.name);
  }
}
