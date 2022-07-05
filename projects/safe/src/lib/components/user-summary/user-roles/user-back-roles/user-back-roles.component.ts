import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Role, User } from '../../../../models/user.model';
import { GetRolesQueryResponse, GET_ROLES } from '../../graphql/queries';

@Component({
  selector: 'safe-user-back-roles',
  templateUrl: './user-back-roles.component.html',
  styleUrls: ['./user-back-roles.component.scss'],
})
export class UserBackRolesComponent implements OnInit {
  public roles: Role[] = [];
  @Input() user!: User;
  selectedRoles!: FormControl;
  @Output() edit = new EventEmitter();

  @Input() set loading(loading: boolean) {
    if (loading) {
      this.selectedRoles?.disable({ emitEvent: false });
    } else {
      this.selectedRoles?.enable({ emitEvent: false });
    }
  }

  constructor(private fb: FormBuilder, private apollo: Apollo) {}

  ngOnInit(): void {
    this.selectedRoles = this.fb.control(
      get(this.user, 'roles', [])
        .filter((x: Role) => !x.application)
        .map((x) => x.id)
    );
    this.selectedRoles.valueChanges.subscribe((value) => {
      this.edit.emit({ roles: value });
    });

    this.loading = true;
    this.apollo
      .query<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .subscribe((res) => {
        if (res.data) {
          this.roles = res.data.roles;
        }
        this.loading = res.loading;
      });
  }
}
