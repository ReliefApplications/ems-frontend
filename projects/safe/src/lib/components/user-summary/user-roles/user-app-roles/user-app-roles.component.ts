import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { get } from 'lodash';
import { Role, User } from '../../../../models/user.model';
import { Application } from '../../../../models/application.model';
import {
  GetApplicationsQueryResponse,
  GetRolesQueryResponse,
  GET_APPLICATIONS,
  GET_ROLES,
} from '../../graphql/queries';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/** Roles tab for the user summary */
@Component({
  selector: 'safe-user-app-roles',
  templateUrl: './user-app-roles.component.html',
  styleUrls: ['./user-app-roles.component.scss'],
})
export class UserAppRolesComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public roles: Role[] = [];
  @Input() user!: User;
  @Input() application?: Application;
  selectedRoles!: FormControl;
  @Output() edit = new EventEmitter();

  /** loading setter */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedRoles?.disable({ emitEvent: false });
    } else {
      this.selectedRoles?.enable({ emitEvent: false });
    }
  }

  selectedApplication!: FormControl;
  public applicationsQuery!: QueryRef<GetApplicationsQueryResponse>;
  private readonly PAGE_SIZE = 10;

  /**
   * Roles tab for the user summary.
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private snackBar: SafeSnackBarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.selectedRoles = this.fb.control(
      get(this.user, 'roles', []).filter((x: Role) => !x.application)
    );
    this.selectedRoles.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.selectedApplication.value) {
          this.edit.emit({
            roles: value,
            application: this.selectedApplication.value,
          });
        }
      });

    this.selectedApplication = this.fb.control({
      value: get(this.application, 'id', ''),
      disabled: !!this.application,
    });
    this.selectedApplication.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.selectedRoles.setValue([], { emitEvent: false });
        this.roles = [];
        if (value) {
          this.getApplicationRoles(value);
        }
      });
    if (this.application) {
      this.getApplicationRoles(this.application.id as string);
    }

    this.applicationsQuery =
      this.apollo.watchQuery<GetApplicationsQueryResponse>({
        query: GET_APPLICATIONS,
        variables: {
          first: this.PAGE_SIZE,
          sortField: 'name',
        },
      });
    this.applicationsQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }

  /**
   * Fetches the roles for a given application
   *
   * @param application The application id
   */
  private getApplicationRoles(application: string): void {
    this.loading = true;
    this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
        variables: {
          application,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res) => {
          if (res.data) {
            this.roles = res.data.roles;
          }
          this.selectedRoles.setValue(
            get(this.user, 'roles', [])
              .filter((x) => x.application?.id === application)
              .map((x) => x.id),
            { emitEvent: false }
          );
          this.loading = false;
        },
        (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        }
      );
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onApplicationSearchChange(search: string): void {
    const variables = this.applicationsQuery.variables;
    this.applicationsQuery.refetch({
      ...variables,
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }
}
