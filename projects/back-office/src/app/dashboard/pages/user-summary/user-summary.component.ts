import { Component, OnInit } from '@angular/core';
import { GetRolesQueryResponse, GET_ROLES } from '../../../graphql/queries';
import { Role } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import { ActivatedRoute } from '@angular/router';

/**
 * User Summary page component.
 */
@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss'],
})
export class UserSummaryComponent implements OnInit {
  public roles: Role[] = [];
  public id = '';

  /**
   * User summary page component.
   *
   * @param apollo Apollo client
   * @param route Angular active route
   */
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
