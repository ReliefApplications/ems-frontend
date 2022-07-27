import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Permission, Role } from '../../../models/user.model';
import {
  GetPermissionsQueryResponse,
  GET_PERMISSIONS,
} from '../graphql/queries';
import { get } from 'lodash';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@Component({
  selector: 'safe-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  @Input() role!: Role;
  public permissions: Permission[] = [];
  public form!: UntypedFormGroup;
  @Output() edit = new EventEmitter();

  /** Setter for the loading state */
  @Input() set loading(loading: boolean) {
    if (loading) {
      this.form?.disable();
    } else {
      this.form?.enable();
    }
  }

  /**
   * General tab of Role Summary.
   * Contain title / description of role + list of users and permissions.
   *
   * @param fb Angular form builder
   * @param apollo Apollo Client
   */
  constructor(private fb: UntypedFormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [this.role.title, Validators.required],
      description: [this.role.description],
      permissions: [get(this.role, 'permissions', []).map((x) => x.id)],
    });
    this.apollo
      .query<GetPermissionsQueryResponse>({
        query: GET_PERMISSIONS,
        variables: {
          application: this.role.application !== null,
        },
      })
      .subscribe((res) => {
        this.permissions = res.data.permissions;
      });
  }

  /**
   * Emit an event with new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
