import {Apollo} from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetRecordDetailsQueryResponse, GET_RECORD_DETAILS } from '../../graphql/queries';
import { Form } from '../../models/form.model';

interface DialogData {
  title: string;
  record: string;
}

@Component({
  selector: 'safe-convert-modal',
  templateUrl: './convert-modal.component.html',
  styleUrls: ['./convert-modal.component.scss']
})
export class SafeConvertModalComponent implements OnInit {

  // === REACTIVE FORM ===
  convertForm: FormGroup = new FormGroup({});

  // === DATA ===
  public form?: Form;
  public availableForms: Form[] = [];
  public ignoredFields: any[] = [];

  // === LOAD DATA ===
  public loading = true;

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeConvertModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
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
      this.loading = false;
      this.availableForms = this.form?.resource?.forms?.filter(x => x.id !== this.form?.id) || [];
    });
    this.convertForm = this.formBuilder.group({
      targetForm: [null, Validators.required],
      copyRecord: [true, Validators.required]
    });
    this.convertForm.get('targetForm')?.valueChanges.subscribe((targetForm: Form) => {
      if (targetForm) {
        this.ignoredFields = this.form?.fields?.filter(sourceField => !targetForm?.fields?.some(
          targetField => sourceField.name === targetField.name)) || [];
      }
    });
  }


  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
