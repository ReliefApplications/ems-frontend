import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Apollo } from 'apollo-angular';
import { GetPermissionsQueryResponse, GET_PERMISSIONS } from '../../../../graphql/queries';
import { Permission, Role } from 'who-shared';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
/*  Modal to add a role.
*/
export class EditRoleComponent implements OnInit {

  // === DATA ===
  public loading = true;
  public permissions: Permission[] = [];

  // === REACTIVE FORM ===
  roleForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EditRoleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      role: Role
    },
    private apollo: Apollo
  ) { }

  /*  Load permissions and build the form.
  */
  ngOnInit(): void {
    this.apollo.watchQuery<GetPermissionsQueryResponse>({
      query: GET_PERMISSIONS
    }).valueChanges.subscribe(res => {
      this.permissions = res.data.permissions;
      this.loading = res.loading;
    });
    this.roleForm = this.formBuilder.group({
      permissions: [this.data.role ? this.data.role.permissions.map(x => x.id) : null]
    });
  }

  /*  Close the modal without sending any data.
  */
  onClose(): void {
    this.dialogRef.close();
  }
}
