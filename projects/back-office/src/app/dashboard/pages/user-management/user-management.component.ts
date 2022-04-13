import { Component, OnInit } from '@angular/core';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  public roles: Role[] = [];
  public id = '';

  constructor(private apollo: Apollo, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeSubscription = this.route.params.subscribe((val: any) => {
      this.id = val.id;
    });
    routeSubscription.unsubscribe();

    this.apollo
      .watchQuery<GetRolesQueryResponse>({
        query: GET_ROLES,
      })
      .valueChanges.subscribe((resRoles: any) => {
        this.roles = resRoles.data.roles;
      });
  }
}
