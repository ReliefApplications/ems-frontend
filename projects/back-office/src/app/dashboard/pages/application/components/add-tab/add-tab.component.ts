import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContentType, Form } from '@who-ems/builder';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from '../../../../../graphql/queries';

@Component({
  selector: 'app-add-tab',
  templateUrl: './add-tab.component.html',
  styleUrls: ['./add-tab.component.scss']
})
export class AddTabComponent implements OnInit {
  // === DATA ===
  public tabTypes = Object.keys(ContentType);
  public forms: Form[];

  // === REACTIVE FORM ===
  public tabForm: FormGroup;
  public showContent = false;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<AddTabComponent>,
    @Inject(MAT_DIALOG_DATA) public data : { showWorkflow: boolean }
  ) { }

  /*  Build the form.
  */
  ngOnInit(): void {
    if (!this.data.showWorkflow) {
      this.tabTypes = this.tabTypes.filter(type => type !==  ContentType.workflow);
    }
    this.tabForm = this.formBuilder.group({
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
    const contentControl = this.tabForm.get('content');
    this.tabForm.get('type').valueChanges.subscribe(type => {
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