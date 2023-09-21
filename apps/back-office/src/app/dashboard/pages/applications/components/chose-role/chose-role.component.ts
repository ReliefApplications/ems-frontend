import { Apollo, QueryRef } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { GET_ROLES } from '../../graphql/queries';
import { Role, RolesQueryResponse } from '@oort-front/safe';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';

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
  roleForm: UntypedFormGroup = new UntypedFormGroup({});

  // === ROLES QUERY ===
  public rolesQuery!: QueryRef<RolesQueryResponse>;

  /**
   * Chose role component, to preview application with selected role.
   *
   * @param formBuilder Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Angular service
   * @param data Injected modal data
   * @param data.application application id
   */
  constructor(
    private formBuilder: UntypedFormBuilder,
    public dialogRef: DialogRef<ChoseRoleComponent>,
    private apollo: Apollo,
    @Inject(DIALOG_DATA)
    public data: {
      application: string;
    }
  ) {}

  ngOnInit(): void {
    this.rolesQuery = this.apollo.watchQuery<RolesQueryResponse>({
      query: GET_ROLES,
      variables: {
        application: this.data.application,
      },
    });

    this.rolesQuery.valueChanges.subscribe(({ loading }) => {
      this.loading = loading;
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
