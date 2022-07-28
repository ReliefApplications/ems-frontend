import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionAttribute } from '@safe/builder';
import { Apollo } from 'apollo-angular';
import {
  GetPositionAttributesFromCategoryQueryResponse,
  GET_POSITION_ATTRIBUTES_FROM_CATEGORY,
} from './graphql/queries';

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
   */
  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id') || '';
    this.backPath = this.router.url.replace(`/${this.id}`, '');
    this.apollo
      .watchQuery<GetPositionAttributesFromCategoryQueryResponse>({
        query: GET_POSITION_ATTRIBUTES_FROM_CATEGORY,
        variables: {
          id: this.id,
        },
      })
      .valueChanges.subscribe((res) => {
        this.positionAttributes = res.data.positionAttributes;
        if (this.positionAttributes.length > 0) {
          this.categoryName = this.positionAttributes[0].category?.title || '';
        }
        this.loading = res.loading;
      });
  }
}
