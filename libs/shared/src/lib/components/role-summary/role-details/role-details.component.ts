import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import {
  Permission,
  PermissionsQueryResponse,
  Role,
} from '../../../models/user.model';
import { GET_PERMISSIONS } from '../graphql/queries';
import { get } from 'lodash';
import { RestService } from '../../../services/rest/rest.service';

/**
 * General tab of Role Summary.
 * Contain title / description of role + list of users and permissions.
 */
@Component({
  selector: 'shared-role-details',
  templateUrl: './role-details.component.html',
  styleUrls: ['./role-details.component.scss'],
})
export class RoleDetailsComponent implements OnInit {
  /** Role to display */
  @Input() role!: Role;
  /** List of permissions */
  public permissions: Permission[] = [];
  /** Form group */
  public form!: ReturnType<typeof this.createRoleForm>;
  /** Event emitter for edit event */
  @Output() edit = new EventEmitter();

  /** Stats of role */
  public roleStats = {
    resources: {
      total: 0,
      limited: 0,
      full: 0,
    },
    channels: {
      total: 0,
      full: 0,
    },
    pages: {
      total: 0,
      full: 0,
    },
  };

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
   * @param restService Shared rest service
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private restService: RestService
  ) {}

  ngOnInit(): void {
    this.form = this.createRoleForm(this.role);
    this.apollo
      .query<PermissionsQueryResponse>({
        query: GET_PERMISSIONS,
        variables: {
          application: this.role.application !== null,
        },
      })
      .subscribe(({ data }) => {
        this.permissions = data.permissions;
      });
    const url = `/roles/${this.role.id}/summary`;
    this.restService.get(url).subscribe((res: any) => {
      this.roleStats = res;
    });
  }

  /**
   * Create role form
   *
   * @param role Current role
   * @returns form group
   */
  createRoleForm(role: Role) {
    return this.fb.group({
      title: [role.title, Validators.required],
      description: [role.description],
      permissions: [get(role, 'permissions', []).map((x) => x.id)],
    });
  }

  /**
   * Emit an event with new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
