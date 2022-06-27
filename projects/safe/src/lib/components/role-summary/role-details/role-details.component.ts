import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { Permission, Role } from '../../../models/user.model';
import {
  GetPermissionsQueryResponse,
  GET_PERMISSIONS,
} from '../graphql/queries';
import { get } from 'lodash';

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

  onUpdate(): void {
    this.edit.emit(this.form.value);
  }
}
