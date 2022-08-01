import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Application } from '../../../../models/application.model';
import { Permission, Role } from '../../../../models/user.model';
import {
  GetPermissionsQueryResponse,
  GET_PERMISSIONS,
} from '../../graphql/queries';

/**
 * General information component for the Role Summary
 * Contain title / description of role + list of users and permissions.
 */
@Component({
  selector: 'safe-general-role-details',
  templateUrl: './general-role-details.component.html',
  styleUrls: ['./general-role-details.component.scss'],
})
export class GeneralRoleDetailsComponent implements OnInit {
  @Input() role!: Role;
  @Input() application?: Application;
  public permissions: Permission[] = [];
  public form!: FormGroup;
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
   * General information component for the Role Summary
   * Contain title / description of role + list of users and permissions.
   *
   * @param fb Angular form builder
   * @param apollo Apollo Client
   */
  constructor(private fb: FormBuilder, private apollo: Apollo) {}

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
