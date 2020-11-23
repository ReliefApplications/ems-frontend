import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetRolesQueryResponse, GET_ROLES } from '../../../../../graphql/queries';
import { Role } from '@who-ems/builder';

@Component({
  selector: 'app-chose-role',
  templateUrl: './chose-role.component.html',
  styleUrls: ['./chose-role.component.scss']
})
export class ChoseRoleComponent implements OnInit {

  // === DATA ===
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  rolesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChoseRoleComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA) public data: {
      application: string
    }
  ) { }

  ngOnInit(): void {
    this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES,
      variables: {
        application: this.data.application
      }
    }).valueChanges.subscribe(res => {
      this.roles = res.data.roles;
    });
    this.rolesForm = this.formBuilder.group({
      roles: [null, Validators.required]
    });
  }

  /* Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
