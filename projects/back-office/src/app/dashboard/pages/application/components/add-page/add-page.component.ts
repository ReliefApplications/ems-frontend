import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ContentType, Form } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from '../../../../../graphql/queries';

@Component({
  selector: 'app-add-page',
  templateUrl: './add-page.component.html',
  styleUrls: ['./add-page.component.scss']
})
export class AddPageComponent implements OnInit {

  // === DATA ===
  public pageTypes = Object.keys(ContentType);
  public forms: Form[];

  // === REACTIVE FORM ===
  public pageForm: FormGroup;
  public showContent = false;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<AddPageComponent>,
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    this.pageForm = this.formBuilder.group({
      name: [''],
      type: ['', Validators.required],
      content: [''],
    });
    this.changeDisplay();
  }

  /* Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

  /* Change the form's display by adding a Content field if the selected type is form.
     Also fetch forms to display them in the select.
  */
  changeDisplay() {
    const contentControl = this.pageForm.get('content');
    this.pageForm.get('type').valueChanges.subscribe(type => {
      if (type === ContentType.form) {
        this.apollo.watchQuery<GetFormsQueryResponse>({
          query: GET_FORMS,
        }).valueChanges.subscribe((res) => {
          this.forms = res.data.forms
          contentControl.setValidators([Validators.required]);
          contentControl.updateValueAndValidity();
          this.showContent = true;
        });
      } else {
        contentControl.setValidators(null);
        contentControl.setValue(null);
        contentControl.updateValueAndValidity();
        this.showContent = false;
      }
    });
  } 
}
