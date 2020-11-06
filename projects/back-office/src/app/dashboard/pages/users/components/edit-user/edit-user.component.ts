import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetRolesQueryResponse, GET_ROLES } from '../../../../../graphql/queries';
import { Role } from '@who-ems';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
/*  Modal to edit an user.
*/
export class EditUserComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      roles: Role[]
    },
    private apollo: Apollo
  ) { }

  /*  Load the roles and build the form.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES
    }).valueChanges.subscribe(res => {
      this.roles = res.data.roles;
      this.loading = res.loading;
    });
    this.userForm = this.formBuilder.group({
      roles: [this.data.roles ? this.data.roles.map(x => x.id) : null]
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }

}
