import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetFormByIdQueryResponse, GET_FORM_BY_ID } from '../../graphql/queries';
import { Form } from '../../models/form.model';
import { Record } from '../../models/record.model';
import { SafeFormModalComponent } from '../form-modal/form-modal.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeChooseRecordModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      targetForm: Form,
      targetFormField: string
    },
    public dialog: MatDialog
  ) { }

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


  /*  Close the modal without sending data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

  /* Open new dialog with the new data
  */
  openDataDialog(): void {
    const dialogRef = this.dialog.open(SafeFormModalComponent, {
      data: {
        recordId: this.chooseRecordForm.value.record.id,
        locale: 'en'
      }
    });
  }
}
