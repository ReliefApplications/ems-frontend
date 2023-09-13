import { Apollo, QueryRef } from 'apollo-angular';
import { Component, Inject, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';
import { Role } from '@oort-front/safe';
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
  /** Available roles */
  public roles: Role[] = [];
  /** Loading indicator */
  public loading = true;
  /** Role reactive form group */
  public roleForm = this.fb.group({
    role: [null, Validators.required],
  });
  /** GraphQL roles query */
  public rolesQuery!: QueryRef<GetRolesQueryResponse>;

  /**
   * Chose role component, to preview application with selected role.
   *
   * @param fb Angular form builder
   * @param dialogRef Dialog ref
   * @param apollo Angular service
   * @param data Injected modal data
   * @param data.application application id
   */
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<ChoseRoleComponent>,
    private apollo: Apollo,
    @Inject(DIALOG_DATA)
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

    this.rolesQuery.valueChanges.subscribe(({ loading }) => {
      this.loading = loading;
    });
  }

  /** Close the modal without sending any data. */
  onClose(): void {
    this.dialogRef.close();
  }
}
