import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Role, RolesQueryResponse, User } from '../../../../models/user.model';
import { GET_ROLES } from '../../graphql/queries';
import { SnackbarService } from '@oort-front/ui';

/** Back-office roles section the user summary */
@Component({
  selector: 'shared-user-back-roles',
  templateUrl: './user-back-roles.component.html',
  styleUrls: ['./user-back-roles.component.scss'],
})
export class UserBackRolesComponent implements OnInit {
  /** Roles */
  public roles: Role[] = [];
  /** User */
  @Input() user!: User;
  /** Selected roles */
  selectedRoles!: ReturnType<typeof this.createFormControl>;
  /** Event emitter for the edit event */
  @Output() edit = new EventEmitter();

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedRoles?.disable({ emitEvent: false });
    } else {
      this.selectedRoles?.enable({ emitEvent: false });
    }
  }

  /**
   * Back-office roles section the user summary
   *
   * @param fb Angular form builder
   * @param apollo Apollo client
   * @param snackBar Shared snackbar service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private snackBar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.selectedRoles = this.createFormControl();
    this.selectedRoles.valueChanges.subscribe((value) => {
      this.edit.emit({ roles: value });
    });

    this.loading = true;
    this.apollo
      .query<RolesQueryResponse>({
        query: GET_ROLES,
      })
      .subscribe({
        next: ({ data, loading }) => {
          if (data) {
            this.roles = data.roles;
          }
          this.loading = loading;
        },
        error: (err) => {
          this.snackBar.openSnackBar(err.message, { error: true });
        },
      });
  }

  /**
   * Create form control
   *
   * @returns form control
   */
  private createFormControl() {
    return this.fb.control(
      get(this.user, 'roles', [])
        .filter((x: Role) => !x.application)
        .map((x) => x.id)
    );
  }
}
