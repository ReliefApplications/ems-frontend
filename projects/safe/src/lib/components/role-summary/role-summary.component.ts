import { Component, Input, OnInit } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Role } from '../../models/user.model';
import { EditRoleMutationResponse, EDIT_ROLE } from './graphql/mutations';
import { GetRoleQueryResponse, GET_ROLE } from './graphql/queries';

@Component({
  selector: 'safe-role-summary',
  templateUrl: './role-summary.component.html',
  styleUrls: ['./role-summary.component.scss'],
})
export class SafeRoleSummaryComponent implements OnInit {
  @Input() id = '';
  public role?: Role;
  public loading = true;

  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.apollo
      .query<GetRoleQueryResponse>({
        query: GET_ROLE,
        variables: {
          id: this.id,
        },
      })
      .subscribe((res) => {
        if (res.data) {
          this.role = res.data.role;
        }
        this.loading = res.data.loading;
      });
  }

  onEditRole(e: any): void {
    console.log({ ...e, id: this.id });
    this.loading = true;
    this.apollo
      .mutate<EditRoleMutationResponse>({
        mutation: EDIT_ROLE,
        variables: { ...e, id: this.id },
      })
      .subscribe((res) => {
        if (res.data) {
          this.role = res.data.editRole;
          this.loading = res.data.loading;
        }
      });
  }
}
