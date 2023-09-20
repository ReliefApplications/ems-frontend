import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  PositionAttribute,
  PositionAttributesQueryResponse,
  SafeBreadcrumbService,
} from '@oort-front/safe';
import { Apollo } from 'apollo-angular';
import { GET_POSITION_ATTRIBUTES_FROM_CATEGORY } from './graphql/queries';

/**
 * Position attributes component.
 */
@Component({
  selector: 'app-position',
  templateUrl: './position-attributes.component.html',
  styleUrls: ['./position-attributes.component.scss'],
})
export class PositionAttributesComponent implements OnInit {
  // === DATA ===
  public loading = true;
  public id = '';
  public categoryName = '';
  public displayedColumns = ['value', 'usersCount'];
  public positionAttributes: PositionAttribute[] = [];
  public backPath = '';

  /**
   * Position attributes component.
   *
   * @param apollo Apollo service
   * @param route Angular activated route
   * @param router Angular router
   * @param breadcrumbService Shared breadcrumb service
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router,
    private breadcrumbService: SafeBreadcrumbService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.backPath = this.router.url.replace(`/${this.id}`, '');
    this.apollo
      .query<PositionAttributesQueryResponse>({
        query: GET_POSITION_ATTRIBUTES_FROM_CATEGORY,
        variables: {
          id: this.id,
        },
      })
      .subscribe(({ data, loading }) => {
        this.positionAttributes = data.positionAttributes;
        if (this.positionAttributes.length > 0) {
          this.categoryName = this.positionAttributes[0].category?.title || '';
          this.breadcrumbService.setBreadcrumb('@attribute', this.categoryName);
        }
        this.loading = loading;
      });
  }
}
