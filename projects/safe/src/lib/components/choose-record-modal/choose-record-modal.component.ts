import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';

@Component({
  selector: 'safe-choose-record-modal',
  templateUrl: './choose-record-modal.component.html',
  styleUrls: ['./choose-record-modal.component.scss']
})
export class SafeChooseRecordModalComponent implements OnInit {

  // === REACTIVE FORM ===
  chooseRecordForm: FormGroup = new FormGroup({});

  // === DATA ===
  public records: Record[] = [];

  // === LOAD DATA ===
  public loading = true;
  public isSearchActivated = false;
  public selectedRows: any [] = [];

  public width: any = 360;
  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeChooseRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      targetForm: Form,
      targetFormField: string,
      targetFormQuery: any
    }
  ) {}

  ngOnInit(): void {
    this.apollo.watchQuery<GetFormByIdQueryResponse>({
      query: GET_FORM_BY_ID,
      variables: {
        id: this.data.targetForm.id,
        display: false
      }
    }).valueChanges.subscribe(res => {
      this.records = res.data.form.records || [];
      this.loading = false;
    });
    this.chooseRecordForm = this.formBuilder.group({
      record: [null, Validators.required]
    });
  }

  onSearch(): void {
    this.isSearchActivated = !this.isSearchActivated;
    this.isSearchActivated ? this.width = 1060 : this.width = 360;
  }

  onRowSelected(rows: any): void {
    this.chooseRecordForm.get('record')?.setValue(rows.selectedRows[0].dataItem.id);
  }
  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
