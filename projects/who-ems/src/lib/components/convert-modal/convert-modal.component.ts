import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogContainerDirective } from '@progress/kendo-angular-dialog';
import { Apollo } from 'apollo-angular';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS } from '../../graphql/queries';
import { Form } from '../../models/form.model';

@Component({
  selector: 'who-convert-modal',
  templateUrl: './convert-modal.component.html',
  styleUrls: ['./convert-modal.component.scss']
})
export class WhoConvertModalComponent implements OnInit {

  // === REACTIVE FORM ===
  convertForm: FormGroup;

  // === DATA ===
  public form: Form;
  public availableForms: Form[];
  public ignoredFields: string[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<WhoConvertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      record: string
    }
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetRecordDetailsQueryResponse>({
      query: GET_RECORD_DETAILS,
      variables: {
        id: this.data.record
      }
    }).valueChanges.subscribe(res => {
      const record = res.data.record;
      this.form = record.form;
      this.availableForms = this.form.resource.forms.filter(x => x.id !== this.form.id);
    });
    this.convertForm = this.formBuilder.group({
      targetForm: [null, Validators.required],
      deleteSource: [false, Validators.required]
    });
    this.convertForm.get('targetForm').valueChanges.subscribe((targetForm: Form) => {
      if (targetForm) {
        this.ignoredFields = this.form.fields.filter(x => !targetForm.fields.some(y => x.name === y.name));
      }
    });
  }


  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
