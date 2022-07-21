import { Apollo } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { Role } from '@safe/builder';

@Component({
  selector: 'app-chose-role',
  templateUrl: './chose-role.component.html',
  styleUrls: ['./chose-role.component.scss'],
})
export class ChoseRoleComponent implements OnInit {
  // === DATA ===
  public roles: Role[] = [];
  public loading = true;

  // === REACTIVE FORM ===
  roleForm: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ChoseRoleComponent>,
    private apollo: Apollo,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      application: string;
    }
  ) {}

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
        this.loading = res.data.loading;
      });
    this.roleForm = this.formBuilder.group({
      role: [null, Validators.required],
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
