import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';

@Component({
  selector: 'who-choose-record-modal',
  templateUrl: './choose-record-modal.component.html',
  styleUrls: ['./choose-record-modal.component.scss']
})
export class WhoChooseRecordModalComponent implements OnInit {

  // === REACTIVE FORM ===
  chooseRecordForm: FormGroup;

  // === DATA ===
  public records: Record[];

  // === LOAD DATA ===
  public loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<WhoChooseRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      targetForm: Form,
      targetFormField: string
    }
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.data.targetForm.id,
        display: false
      }
    }).valueChanges.subscribe(res => {
      this.records = res.data.form.records;
      this.loading = false;
    });
    this.chooseRecordForm = this.formBuilder.group({
      record: [null, Validators.required]
    });
  }


  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}