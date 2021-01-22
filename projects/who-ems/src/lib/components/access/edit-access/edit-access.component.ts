import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role } from '../../../models/user.model';

@Component({
  selector: 'who-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss']
})
export class WhoEditAccessComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  accessForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<WhoEditAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      access: any,
      application: string
    }
  ) { }

  /*  Get list of roles, and build the form.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES,
      variables: {
        application: this.data.application
      }
    }).valueChanges.subscribe(res => {
      this.roles = res.data.roles;
      this.loading = res.loading;
    });
    this.accessForm = this.formBuilder.group({
      canSee: [this.data.access.canSee ? this.data.access.canSee.map(x => x.id) : null],
      canCreate: [this.data.access.canCreate ? this.data.access.canCreate.map(x => x.id) : null],
      canUpdate: [this.data.access.canUpdate ? this.data.access.canUpdate.map(x => x.id) : null],
      canDelete: [this.data.access.canDelete ? this.data.access.canDelete.map(x => x.id) : null]
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
