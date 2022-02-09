import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role } from '../../../models/user.model';

interface DialogData {
  access: any;
  application: string;
}

@Component({
  selector: 'safe-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss'],
})
export class SafeEditAccessComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public roles: Role[] = [];

  // === REACTIVE FORM ===
  accessForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    private apollo: Apollo,
    public dialogRef: MatDialogRef<SafeEditAccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  /*  Get list of roles, and build the form.
   */
  ngOnInit(): void {
    this.apollo
      .watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application: this.data.application,
        },
      })
      .valueChanges.subscribe((res) => {
        this.roles = res.data.roles;
        this.loading = res.loading;
      });
    this.accessForm = this.formBuilder.group({
      canSee: [
        this.data.access.canSee
          ? this.data.access.canSee.map((x: any) => x.id)
          : null,
      ],
      canUpdate: [
        this.data.access.canUpdate
          ? this.data.access.canUpdate.map((x: any) => x.id)
          : null,
      ],
      canDelete: [
        this.data.access.canDelete
          ? this.data.access.canDelete.map((x: any) => x.id)
          : null,
      ],
    });
  }

  /*  Close the modal without sending any data.
   */
  onClose(): void {
    this.dialogRef.close();
  }
}
