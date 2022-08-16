import { Apollo, QueryRef } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { Role } from '@safe/builder';

/**
 * Chose role component, to preview application with selected role.
 */
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

  // === ROLES QUERY ===
  public rolesQuery!: QueryRef<GetRolesQueryResponse>;
  /**
   * Chose role component, to preview application with selected role.
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Material dialog ref
   * @param apollo Angular service
   * @param data Injected modal data
   * @param data.application application id
   */
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
    this.rolesQuery = this.apollo.watchQuery<GetRolesQueryResponse>({
      query: GET_ROLES,
      variables: {
        application: this.data.application,
      },
    });

    this.rolesQuery.valueChanges.subscribe((res) => {
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
