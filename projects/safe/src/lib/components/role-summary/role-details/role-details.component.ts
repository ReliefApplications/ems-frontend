import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Permission, Role } from '../../../models/user.model';
import {
  GetPermissionsQueryResponse,
  GET_PERMISSIONS,
} from '../graphql/queries';
import { get } from 'lodash';
import { HttpClient } from '@angular/common/http';

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
  public form!: FormGroup;
  @Output() edit = new EventEmitter();

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
   * @param http http client
   */
  constructor(
    private fb: FormBuilder,
    private apollo: Apollo,
    private http: HttpClient
  ) {}

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
    const url = `http://localhost:3000/roles/${this.role.id}/summary`;
    this.http.get(url).subscribe((res: any) => {
      this.roleStats = res;
    });
  }

  /**
   * Emit an event with new role value
   */
  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
