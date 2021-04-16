import {Apollo} from 'apollo-angular';
import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DuplicateApplicationMutationResponse, DUPLICATE_APPLICATION} from '../../graphql/mutations';
import { Application, SafeSnackBarService } from '@safe/builder';
import notifications from 'projects/safe/src/lib/const/notifications';


@Component({
  selector: 'app-duplicate-application',
  templateUrl: './duplicate-application.component.html',
  styleUrls: ['./duplicate-application.component.scss']
})
export class DuplicateApplicationComponent implements OnInit {

  public currentApp: Application;
  public duplicateForm: FormGroup = new FormGroup({});

  constructor(
    private snackBar: SafeSnackBarService,
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<DuplicateApplicationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.currentApp = data;
    }

  ngOnInit(): void {
    this.duplicateForm = this.formBuilder.group(
      {
        name: ['', Validators.required]
      }
    );
  }

  onSubmit(): void {
    this.apollo.mutate<DuplicateApplicationMutationResponse>({
      mutation: DUPLICATE_APPLICATION,
      variables: {
        name: this.duplicateForm.value.name,
        application:  this.currentApp.id,
      }
    }).subscribe(res => {
      if (res.errors) {
        this.snackBar.openSnackBar(notifications.objectNotDuplicated('App', res.errors[0].message));
      } else {
        this.snackBar.openSnackBar(notifications.objectDuplicated('App', this.currentApp.name));
        this.dialogRef.close(res.data?.duplicateApplication);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
