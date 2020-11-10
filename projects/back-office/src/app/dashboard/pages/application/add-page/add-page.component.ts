import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentType } from '@who-ems/builder';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

  // === PAGE TYPE ===
  public pageTypes = Object.keys(ContentType);
  public foo = [1, 2, 3];

  // === REACTIVE FORM ===
  public pageForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPageComponent>
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.pageForm = this.formBuilder.group({
      name: [''],
      type: ['', Validators.required],
    });
  }

  /* Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
